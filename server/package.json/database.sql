-- =========================================================================
-- DevPortal & Engineering Onboarding Platform - PostgreSQL Schema Layout
-- Purpose: Architectural reference for code review and visual inspection
-- =========================================================================

-- Drop tables if resetting schema structure
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS sprint_timecards CASCADE;
DROP TABLE IF EXISTS developer_applications CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Core Users Table (Engineers, Contributors, DevOps Leads)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'Contributor', -- 'DevOps Lead', 'Junior Developer', 'Admin'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Developer Onboarding & Candidate Pipeline Table
CREATE TABLE developer_applications (
    id SERIAL PRIMARY KEY,
    candidate_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    tech_stack VARCHAR(250) NOT NULL, -- e.g., 'JavaScript, React, Node.js, PostgreSQL'
    experience_level VARCHAR(50), -- 'Junior', 'Mid-Level', 'Senior'
    status VARCHAR(50) DEFAULT 'Pending Review', -- 'Pending', 'Interviewing', 'Approved'
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Sprint Availability & Time Tracking Table
CREATE TABLE sprint_timecards (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    sprint_week VARCHAR(50) NOT NULL, -- e.g., 'Sprint 2026-W39'
    hours_logged NUMERIC(5,2) DEFAULT 0.00,
    task_description TEXT,
    status VARCHAR(30) DEFAULT 'Submitted',
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. System Audit & Deployment Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    actor_id INT REFERENCES users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL, -- e.g., 'DEPLOYMENT_TRIGGERED', 'CONFIG_UPDATED'
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- Initial Seed Data (For visual verification in database inspection tools)
-- =========================================================================
INSERT INTO users (username, email, role) VALUES 
('devops_lead', 'lead@devportal.internal', 'DevOps Lead'),
('jdoe_eng', 'john.doe@devportal.internal', 'Junior Developer');

INSERT INTO developer_applications (candidate_name, email, tech_stack, experience_level, status) VALUES 
('Alex Chen', 'alex.chen@example.com', 'Node.js, Express, PostgreSQL', 'Mid-Level', 'Approved'),
('Sarah Jenkins', 'sarah.j@example.com', 'React, JavaScript, Tailwind', 'Junior', 'Pending Review');

