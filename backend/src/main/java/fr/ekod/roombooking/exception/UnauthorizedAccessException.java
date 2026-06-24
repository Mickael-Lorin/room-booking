package fr.ekod.roombooking.exception;

public class UnauthorizedAccessException extends RuntimeException {

    public UnauthorizedAccessException() {
        super("Authentification requise");
    }

    public UnauthorizedAccessException(String message) {
        super(message);
    }
}
