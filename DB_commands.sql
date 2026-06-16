PRAGMA foreign_keys = ON;



CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);



CREATE TABLE horses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    discipline TEXT NOT NULL,
    daily_limit INTEGER NOT NULL DEFAULT 2
);



CREATE TABLE trainers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    specialization TEXT
);



CREATE TABLE training_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    discipline TEXT NOT NULL
        CHECK (discipline IN ('Dressage', 'Jumping', 'Recreational')),

    training_mode TEXT NOT NULL
        CHECK (training_mode IN ('individual', 'group'))
);



CREATE TABLE trainings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    horse_id INTEGER NOT NULL,
    trainer_id INTEGER NOT NULL,
    training_type_id INTEGER NOT NULL,

    date TEXT NOT NULL,

    capacity INTEGER NOT NULL DEFAULT 1,

    status TEXT NOT NULL DEFAULT 'open'
        CHECK (status IN ('open', 'full', 'completed', 'cancelled')),

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (horse_id)
        REFERENCES horses(id),

    FOREIGN KEY (trainer_id)
        REFERENCES trainers(id),

    FOREIGN KEY (training_type_id)
        REFERENCES training_types(id)
);



CREATE TABLE training_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    training_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    FOREIGN KEY (training_id)
        REFERENCES trainings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- INITIAL DATA POPULATION
-- ==========================================

-- Populate Training Types
INSERT INTO training_types (discipline, training_mode) VALUES 
    ('Dressage', 'individual'),
    ('Dressage', 'group'),
    ('Jumping', 'individual'),
    ('Jumping', 'group'),
    ('Recreational', 'individual'),
    ('Recreational', 'group');

-- Populate Trainers
INSERT INTO trainers (name, surname, specialization) VALUES 
    ('John', 'Smith', 'Show Jumping'),
    ('Sarah', 'Connor', 'Dressage Expert'),
    ('Michael', 'Davis', 'Beginners & Recreational'),
    ('Emma', 'Wilson', 'Advanced Jumping');

-- Populate Horses
INSERT INTO horses (name, discipline, daily_limit) VALUES 
    ('Apollo', 'Jumping', 2),
    ('Bella', 'Dressage', 2),
    ('Charlie', 'Recreational', 3),
    ('Dakota', 'Jumping', 1),
    ('Eclipse', 'Dressage', 2),
    ('Fiona', 'Recreational', 4);

-- Populate Upcoming Trainings
-- (Assuming trainer_id 1 (John), horse_id 1 (Apollo), type 3 (Jumping individual))
INSERT INTO trainings (horse_id, trainer_id, training_type_id, date, capacity, status) VALUES 
    (1, 1, 3, datetime('now', '+1 day', 'start of day', '+10 hours'), 1, 'open'),
    (2, 2, 1, datetime('now', '+2 days', 'start of day', '+14 hours'), 1, 'open'),
    (3, 3, 6, datetime('now', '+1 day', 'start of day', '+16 hours'), 4, 'open'),
    (4, 4, 3, datetime('now', '+3 days', 'start of day', '+09 hours'), 1, 'open'),
    (5, 2, 2, datetime('now', '+4 days', 'start of day', '+11 hours'), 3, 'open');
