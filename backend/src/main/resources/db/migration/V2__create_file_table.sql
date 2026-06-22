CREATE TABLE roomfiles (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      path VARCHAR(255) NOT NULL,
                      file_type VARCHAR(100) NOT NULL,
                      size BIGINT NOT NULL,
                      room INT NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_file_room_id ON roomfiles(room);

