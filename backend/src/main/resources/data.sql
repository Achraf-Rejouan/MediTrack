INSERT INTO users (username, email, password, role)
VALUES
('admin', 'admin@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'ADMIN'),
('doctor1', 'doctor1@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'DOCTOR'),
('doctor2', 'doctor2@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'DOCTOR'),
('doctor3', 'doctor3@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'DOCTOR'),
ON CONFLICT (username) DO NOTHING;

INSERT INTO admins (id)
SELECT id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (id, first_name, last_name, specialty)
SELECT id, 'John', 'Smith', 'General Medicine' FROM users WHERE username = 'doctor1'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (id, first_name, last_name, specialty)
SELECT id, 'Sarah', 'Johnson', 'Cardiology' FROM users WHERE username = 'doctor2'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (id, first_name, last_name, specialty)
SELECT id, 'Michael', 'Brown', 'Neurology' FROM users WHERE username = 'doctor3'
ON CONFLICT DO NOTHING;