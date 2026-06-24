ALTER TABLE reservations
    ADD COLUMN attendees_count INTEGER NOT NULL DEFAULT 1;

ALTER TABLE reservations
    ALTER COLUMN attendees_count DROP DEFAULT;
