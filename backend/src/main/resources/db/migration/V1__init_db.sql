CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        last_name VARCHAR(100) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(25) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        active BOOLEAN DEFAULT TRUE
);
CREATE TABLE room (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description VARCHAR(255),
    capacity INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    equipment VARCHAR(255),
    available BOOLEAN DEFAULT TRUE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservation (
    id SERIAL PRIMARY KEY,
    start_date_time DATE NOT NULL,
    end_date_time DATE NOT NULL,
    status VARCHAR(255) NOT NULL,
    purpose VARCHAR(255),
    user_id INT NOT NULL REFERENCES users(id),
    room_id INT NOT NULL REFERENCES room(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);