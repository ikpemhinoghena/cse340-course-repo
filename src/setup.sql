-- Create the organization table
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- Insert sample data
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');




--- 1. Create the project table (Required before the junction table)
CREATE TABLE IF NOT EXISTS project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER REFERENCES organization(organization_id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- 2. Create the category table
CREATE TABLE IF NOT EXISTS category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 3. Create the junction table for Many-to-Many relationship
CREATE TABLE IF NOT EXISTS project_category (
    project_id INTEGER REFERENCES project(project_id),
    category_id INTEGER REFERENCES category(category_id),
    PRIMARY KEY (project_id, category_id)
);

-- 4. Insert Sample Projects (Linking to your existing organizations)
-- Note: Adjust organization_id (1, 2, 3) if your IDs are different
INSERT INTO project (organization_id, title, description, location, project_date) VALUES 
(1, 'Community Garden Build', 'Building raised beds for a local school.', 'Springfield Park', '2026-06-15'),
(1, 'Senior Center Renovation', 'Painting and repairing the local senior center.', 'Downtown Community Hall', '2026-07-01'),
(2, 'Urban Farm Workshop', 'Teaching kids how to grow their own food.', 'GreenHarvest Fields', '2026-06-20'),
(3, 'Food Drive Coordination', 'Collecting and sorting canned goods.', 'UnityServe HQ', '2026-08-10');

-- 5. Insert Sample Categories
INSERT INTO category (name) VALUES 
('Education'),
('Health'),
('Environment'),
('Community Service');

-- 6. Associate Projects with Categories
-- (Project 1 is Environment & Community Service, etc.)
INSERT INTO project_category (project_id, category_id) VALUES 
(1, 3), -- Project 1 is Environment
(1, 4), -- Project 1 is also Community Service
(2, 4), -- Project 2 is Community Service
(3, 1), -- Project 3 is Education
(3, 3), -- Project 3 is also Environment
(4, 2); -- Project 4 is Health



-- ==========================================
-- WEEK 05: AUTHENTICATION & ROLES
-- ==========================================

-- Create roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Seed initial roles
INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

-- Create users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- WEEK 06: VOLUNTEER TRACKING
-- ==========================================

-- Table to track which users have volunteered for which projects
CREATE TABLE IF NOT EXISTS volunteers (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    project_id INT REFERENCES project(project_id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, project_id)
);