CREATE TABLE file (
                      id SERIAL PRIMARY KEY,
                      name VARCHAR(255) NOT NULL,
                      s3_key_or_url VARCHAR(512) NOT NULL,
                      mime_type VARCHAR(100) NOT NULL,
                      size_bytes BIGINT NOT NULL,
                      room_id INT NOT NULL REFERENCES room(id) ON DELETE CASCADE,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_file_room_id ON file(room_id);

ALTER TABLE reservation ALTER COLUMN start_date_time TYPE TIMESTAMP;
ALTER TABLE reservation ALTER COLUMN end_date_time TYPE TIMESTAMP;