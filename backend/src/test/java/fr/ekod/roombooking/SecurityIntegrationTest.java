package fr.ekod.roombooking;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fr.ekod.roombooking.repository.ReservationRepository;
import fr.ekod.roombooking.repository.RoomRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.context.ApplicationContext;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests d'intégration — sécurité et codes HTTP.
 *
 * Contexte complet (@SpringBootTest) avec le vrai SecurityConfig et le vrai filtre JWT.
 * Les tests écrivent dans la vraie base ; les données jetables sont nettoyées dans @AfterEach.
 *
 * Matrice de sécurité couverte :
 * ┌─────────────────────────────────┬────────┬──────┬───────┐
 * │ Endpoint                        │ Public │ USER │ ADMIN │
 * ├─────────────────────────────────┼────────┼──────┼───────┤
 * │ GET  /api/rooms                 │  200   │  200 │  200  │
 * │ POST /api/admin/rooms           │  401   │  403 │  201  │
 * │ DELETE /api/admin/rooms/{id}    │   —    │  403 │  204  │
 * │ GET  /api/reservations/me       │  401   │  200 │   —   │
 * │ POST /api/reservations          │   —    │  201 │   —   │
 * │ POST /api/reservations (invalid)│   —    │  400 │   —   │
 * │ POST /api/v1/auth/register      │  400   │   —  │   —   │
 * └─────────────────────────────────┴────────┴──────┴───────┘
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
class SecurityIntegrationTest {

    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper()
            .findAndRegisterModules();

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    private String userToken;
    private String adminToken;

    /** IDs des réservations créées durant les tests, à supprimer en @AfterEach. */
    private final List<Long> createdReservationIds = new ArrayList<>();

    // ──────────────────────────────────────────────────────────────────────────
    // Setup / Teardown
    // ──────────────────────────────────────────────────────────────────────────

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        userToken  = loginAndGetToken("user@ekod.fr",  "user!");
        adminToken = loginAndGetToken("admin@ekod.fr", "admin!");
    }

    @AfterEach
    void tearDown() {
        // 1. Supprimer les réservations de test (contrainte FK avant les salles)
        createdReservationIds.forEach(id ->
                reservationRepository.findById(id).ifPresent(reservationRepository::delete)
        );
        createdReservationIds.clear();

        // 2. Supprimer les salles dont le nom commence par "TEST"
        roomRepository.findAll().stream()
                .filter(r -> r.getName().startsWith("TEST"))
                .forEach(roomRepository::delete);
    }

    /**
     * Méthode utilitaire : appelle POST /api/v1/auth/login avec les comptes seedés
     * et retourne l'accessToken JWT.
     */
    private String loginAndGetToken(String email, String password) throws Exception {
        String body = """
                {"email": "%s", "password": "%s"}
                """.formatted(email, password);

        MvcResult result = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("accessToken").asText();
    }

    // ──────────────────────────────────────────────────────────────────────────
    // Tests
    // ──────────────────────────────────────────────────────────────────────────

    /**
     * 1. GET /api/rooms → 200 PUBLIC
     * Un visiteur non authentifié peut lister les salles.
     */
    @Test
    void getRooms_public_returns200() throws Exception {
        mockMvc.perform(get("/api/rooms"))
                .andExpect(status().isOk());
    }

    /**
     * 2. POST /api/admin/rooms sans token → 401 UNAUTHORIZED
     * Toute requête sans JWT sur une route protégée doit être rejetée.
     */
    @Test
    void createRoom_noToken_returns401() throws Exception {
        String body = """
                {"name": "TEST No Auth", "capacity": 5, "location": "Bâtiment TEST"}
                """;

        mockMvc.perform(post("/api/admin/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isUnauthorized());
    }

    /**
     * 3. POST /api/admin/rooms avec token USER → 403 FORBIDDEN
     * Un utilisateur standard ne peut pas accéder aux routes ADMIN.
     */
    @Test
    void createRoom_asUser_returns403() throws Exception {
        String body = """
                {"name": "TEST User Forbidden", "capacity": 5, "location": "Bâtiment TEST"}
                """;

        mockMvc.perform(post("/api/admin/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    /**
     * 4. POST /api/admin/rooms avec token ADMIN → 201 CREATED
     * Un admin peut créer une salle ; le nom est retourné dans la réponse.
     */
    @Test
    void createRoom_asAdmin_returns201() throws Exception {
        String body = """
                {
                  "name": "TEST Admin Room",
                  "capacity": 10,
                  "location": "Bâtiment TEST - 1er étage",
                  "available": true
                }
                """;

        mockMvc.perform(post("/api/admin/rooms")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("TEST Admin Room"))
                .andExpect(jsonPath("$.id").isNumber());
    }

    /**
     * 5. GET /api/reservations/me sans token → 401 UNAUTHORIZED
     * L'historique des réservations n'est pas public.
     */
    @Test
    void getMyReservations_noToken_returns401() throws Exception {
        mockMvc.perform(get("/api/reservations/me"))
                .andExpect(status().isUnauthorized());
    }

    /**
     * 6. GET /api/reservations/me avec token USER → 200 OK
     * Un utilisateur connecté peut consulter ses propres réservations.
     */
    @Test
    void getMyReservations_asUser_returns200() throws Exception {
        mockMvc.perform(get("/api/reservations/me")
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isOk());
    }

    /**
     * 7. POST /api/reservations avec token USER, corps valide → 201 CREATED
     * Crée une réservation sur la première salle disponible seedée.
     * La réservation est tracée pour être supprimée en @AfterEach.
     */
    @Test
    void createReservation_asUser_validBody_returns201() throws Exception {
        Long roomId = roomRepository.findAll().stream()
                .filter(r -> Boolean.TRUE.equals(r.getAvailable()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Aucune salle disponible en base"))
                .getId();

        LocalDateTime start = LocalDateTime.now().plusDays(7).withNano(0);
        LocalDateTime end   = start.plusHours(2);

        String body = """
                {
                  "roomId": %d,
                  "startDateTime": "%s",
                  "endDateTime": "%s",
                  "attendeesCount": 5,
                  "purpose": "Réunion test intégration"
                }
                """.formatted(roomId, start, end);

        MvcResult result = mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        createdReservationIds.add(json.get("id").asLong());
    }

    /**
     * 8. POST /api/reservations avec attendeesCount = 0 → 400 BAD REQUEST
     * La validation @Min(1) doit rejeter un nombre de participants invalide.
     */
    @Test
    void createReservation_asUser_invalidAttendeesCount_returns400() throws Exception {
        Long roomId = roomRepository.findAll().stream()
                .filter(r -> Boolean.TRUE.equals(r.getAvailable()))
                .findFirst()
                .orElseThrow()
                .getId();

        LocalDateTime start = LocalDateTime.now().plusDays(8).withNano(0);
        LocalDateTime end   = start.plusHours(1);

        String body = """
                {
                  "roomId": %d,
                  "startDateTime": "%s",
                  "endDateTime": "%s",
                  "attendeesCount": 0
                }
                """.formatted(roomId, start, end);

        mockMvc.perform(post("/api/reservations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isBadRequest());
    }

    /**
     * 9. POST /api/v1/auth/register avec email invalide → 400 BAD REQUEST
     * La contrainte @Email doit rejeter un format d'adresse incorrect.
     */
    @Test
    void register_invalidEmail_returns400() throws Exception {
        String body = """
                {
                  "firstName": "Test",
                  "lastName": "Integration",
                  "email": "pas-un-email",
                  "password": "motdepasse123"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    /**
     * 10. DELETE /api/admin/rooms/{id} avec token USER → 403 FORBIDDEN
     * Suppression d'une salle réservée aux admins uniquement.
     */
    @Test
    void deleteRoom_asUser_returns403() throws Exception {
        Long roomId = roomRepository.findAll().stream()
                .findFirst()
                .orElseThrow()
                .getId();

        mockMvc.perform(delete("/api/admin/rooms/" + roomId)
                        .header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }
}
