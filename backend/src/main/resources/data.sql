INSERT INTO users (username, email, password, role)
VALUES
('admin', 'admin@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'ADMIN'),
('doctor', 'doctor@meditrack.com', '$2a$10$KPXqbOL6A9p6g5XlJkLULOVlwVB0GCh8SQZvkKPNeK8PI5Qwr5zOi', 'DOCTOR')
ON CONFLICT (username) DO NOTHING;

INSERT INTO admins (id)
SELECT id FROM users WHERE username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO doctors (id, specialty)
SELECT id, 'General Medicine' FROM users WHERE username = 'doctor'
ON CONFLICT DO NOTHING;
