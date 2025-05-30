-- ===================================================================
-- SCHOLARSHIP CONNECTION PLATFORM - DATABASE SCHEMA
-- MySQL Database Design
-- ===================================================================

-- Create Database
CREATE DATABASE swp391_gr6;
USE swp391_gr6;

-- ===================================================================
-- USER MANAGEMENT TABLES
-- ===================================================================

-- Users table (Base table for all user types)
CREATE TABLE users (
    user_id VARCHAR(15) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'seeker') NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

DROP TABLE users;

CREATE TABLE verification_tokens (
    email VARCHAR(255),
    otp_code CHAR(6),
    expires_at TIMESTAMP,
	PRIMARY KEY(email)
);

-- Admin profiles
CREATE TABLE admin_profiles (
    admin_id VARCHAR(15) PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Staff profiles
CREATE TABLE staff_profiles (
    staff_id VARCHAR(15) PRIMARY KEY,
    specialization VARCHAR(200),
    bio TEXT,
    experience_years INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    created_by VARCHAR(15),
    FOREIGN KEY (staff_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Seeker profiles
CREATE TABLE seeker_profiles (
    seeker_id VARCHAR(15) PRIMARY KEY,
    current_education_level ENUM('high_school', 'undergraduate', 'graduate', 'postgraduate'),
    field_of_study VARCHAR(200),
    gpa DECIMAL(4,2),
    target_degree VARCHAR(200),
    target_countries JSON,
    preferred_languages JSON,
    financial_need_level ENUM('low', 'medium', 'high'),
    cv_url VARCHAR(500),
    bio TEXT,
    assigned_staff_id VARCHAR(15),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id)
);

-- ===================================================================
-- SCHOLARSHIP MANAGEMENT TABLES
-- ===================================================================

-- Scholarship categories
CREATE TABLE scholarship_categories (
    category_id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ví dụ insert:
INSERT INTO scholarship_categories (category_id, name, description, icon_url)
VALUES ('SCHOLARCATE0001', 'Ireland Scholarship', 'Scholarship for students learning in Ireland', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270152/ireland_zazwfv.png'),
       ('SCHOLARCATE0002', 'New Zealand Scholarship', 'Scholarship for students learning in New Zealand', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270662/new_zealand_o6j74h.png'),
       ('SCHOLARCATE0003', 'United States Scholarship', 'Scholarship for students learning in United States', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270663/united_state_pzcgq7.png'),
       ('SCHOLARCATE0004', 'Australia Scholarship', 'Scholarship for students learning in Australia', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270651/australia_xz7h10.png'),
       ('SCHOLARCATE0005', 'Canada Scholarship', 'Scholarship for students learning in Canada', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270661/canada_sci5ef.png'),
       ('SCHOLARCATE0006', 'United Kingdom Scholarship', 'Scholarship for students learning in United Kingdom', 'https://res.cloudinary.com/dht9hd5ap/image/upload/v1748270667/united_kingdom_uzwpvx.png');

-- Organizations/Sponsors
CREATE TABLE organizations (
    organization_id VARCHAR(15) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    website_url VARCHAR(500),
    logo_url VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    country VARCHAR(100),
    organization_type ENUM('university', 'government', 'private', 'ngo'),
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ví dụ insert:
INSERT INTO organizations (
    organization_id, name, description, world_rank, logo_url, number_student, avg_cost_living, country, organization_type, is_verified
) VALUES (
    'ORG0000003',
    'The University of Sydney',
    'The University of Sydney, located in Sydney, Australia, is a world-renowned educational institution that is consistently ranked in the top 20 universities in the world (QS World University Rankings, 2024). It is also ranked number 1 in Australia and number 4 globally for graduate employability, according to the QS Graduate Employability Rankings, 2022. Students from all over the world choose to study undergraduate and postgraduate degrees here.

Here, you will have the choice of more than 400 subjects and training programs in Australia, with a total of 5 subjects ranked in the world\'s top 10, and a further 28 subjects ranked in the global top 50 (QS World University Rankings by Subject 2022). Student employment opportunities are enhanced through internships and work placements, as well as study abroad options as part of the university’s degree.

Students will learn, develop and grow in a supportive environment, with a range of services to facilitate their studies. These include academic and professional support, as well as disability support, confidential counselling, health and welfare services and a financial aid office. Students can also join more than 250 clubs and societies, ranging from sporting to cultural activities, run by the University of Sydney Union (USU) on campus.

You can take advantage of the university’s on-campus facilities, including a gym with an Olympic-sized swimming pool and a climbing centre. There are also galleries, museums, cafes, restaurants and bars to keep you entertained, and you can access the largest university library in the southern hemisphere.

The student experience is enhanced and enriched by one of the world’s best cities, Sydney, which was ranked the 4th safest place to live in the world by the Economist’s Safe Cities Index 2021.',
    61,
    'https://images-intl.prod.aws.idp-connect.com/commimg/myhotcourses/institution/myhc_254386.jpg',
    32937,
    963,
    'Australia',
    'University',
    TRUE
);

DESC users;

DESC organizations;

DESC scholarships;

-- Scholarships
CREATE TABLE scholarships (
    scholarship_id VARCHAR(15) PRIMARY KEY,
    title VARCHAR(300) NOT NULL,
    world_rank INT,
    description LONGTEXT,
    organization_id VARCHAR(15) NOT NULL,
    category_id VARCHAR(15) NOT NULL,
    amount DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    application_deadline DATE,
    eligibility_criteria JSON,
    countries JSON,
    education_levels JSON,
    fields_of_study JSON,
    language_requirements JSON,
    status ENUM('draft', 'active', 'inactive', 'expired') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    featured BOOLEAN DEFAULT FALSE,
    created_by VARCHAR(15) NOT NULL,
    approved_by VARCHAR(15),
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organization_id) REFERENCES organizations(organization_id),
    FOREIGN KEY (category_id) REFERENCES scholarship_categories(category_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

INSERT INTO scholarships (
    scholarship_id,
    title,
    description,
    organization_id,
    category_id,
    amount,
    currency,
    duration,
    application_deadline,
    eligibility_criteria,
    countries,
    education_levels,
    fields_of_study,
    language_requirements,
    status,
    views_count,
    applications_count,
    featured,
    created_by,
    approved_by,
    approved_at
) VALUES (
    'SCHOLAR0000007',
    'MSc Marketing (Dubai Campus)',
    'Our new Master of Professional Accounting and Business Performance will give you the skills and experience to bring value to any organisation in a disruptive global economy.
Co-designed with industry, this program will give you a unique, future-proofed skillset that will help you identify business opportunities and solve accounting and business problems in innovative ways to drive organisational performance.

You\'ll develop deep technical skills and progress towards accreditation requirements with CPA Australia, Chartered Accountants Australia and New Zealand (CAANZ) as well as the Association of Chartered Certified Accountants (ACCA).

You\'ll also develop the key analytics, technology and communication skills to lead in enterprise performance management, as well as build your experience with cloud-based accounting technology platforms.
And with opportunities to gain real-world experience, develop transferable career skills and explore corporate social responsibility and governance, you\'ll graduate in-demand and on track to become an ethical business leader in accounting practice, management and beyond.',
    'ORG0000003',
    'SCHOLARCATE0004',
    56500.00,
    'AUD',
    24,
    '2025-08-04',
    '{"nationality": "All international"}',
    '["Darlington, Australia"]',
    '["University"]',
    '["Masters Degree (Coursework)"]',
    '["IELTS 7.0"]',
    'active',
    0,
    0,
    TRUE,
    'USER0000000002',
    NULL,
    NULL
);

-- Scholarship images/documents
CREATE TABLE scholarship_media (
    media_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id VARCHAR(15) NOT NULL,
    media_type ENUM('image', 'document', 'video'),
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_size INT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE
);

-- ===================================================================
-- APPLICATION AND TRACKING TABLES
-- ===================================================================

-- Scholarship applications
CREATE TABLE scholarship_applications (
    application_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id INT NOT NULL,
    seeker_id INT NOT NULL,
    application_status ENUM('draft', 'submitted', 'under_review', 'accepted', 'rejected', 'withdrawn') DEFAULT 'draft',
    application_data JSON,
    documents JSON,
    notes TEXT,
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    decision_date TIMESTAMP NULL,
    decision_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    UNIQUE KEY unique_application (scholarship_id, seeker_id)
);

-- Application status history
CREATE TABLE application_status_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    application_id INT NOT NULL,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by INT,
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES scholarship_applications(application_id) ON DELETE CASCADE,
    FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

-- ===================================================================
-- COMMUNICATION AND COUNSELING TABLES
-- ===================================================================

-- Counseling sessions
CREATE TABLE counseling_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    seeker_id INT NOT NULL,
    staff_id INT NOT NULL,
    session_type ENUM('chat', 'call', 'video', 'in_person'),
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP NULL,
    ended_at TIMESTAMP NULL,
    duration_minutes INT,
    notes TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (staff_id) REFERENCES users(user_id)
);

-- Messages/Chat
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    session_id INT,
    message_type ENUM('text', 'file', 'image', 'system') DEFAULT 'text',
    content TEXT,
    file_url VARCHAR(500),
    file_name VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id),
    FOREIGN KEY (recipient_id) REFERENCES users(user_id),
    FOREIGN KEY (session_id) REFERENCES counseling_sessions(session_id)
);

-- ===================================================================
-- COMMUNITY AND REVIEW TABLES
-- ===================================================================

-- Scholarship reviews
CREATE TABLE scholarship_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id INT NOT NULL,
    seeker_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_title VARCHAR(200),
    review_content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    helpful_votes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    UNIQUE KEY unique_review (scholarship_id, seeker_id)
);

-- Staff reviews
CREATE TABLE staff_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    staff_id INT NOT NULL,
    seeker_id INT NOT NULL,
    session_id INT,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_content TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES users(user_id),
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (session_id) REFERENCES counseling_sessions(session_id)
);

-- Comments on scholarships
CREATE TABLE scholarship_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    scholarship_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (parent_comment_id) REFERENCES scholarship_comments(comment_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- ===================================================================
-- FAVORITES AND BOOKMARKS TABLES
-- ===================================================================

-- Favorite scholarships
CREATE TABLE favorite_scholarships (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    seeker_id INT NOT NULL,
    scholarship_id INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seeker_id) REFERENCES users(user_id),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(scholarship_id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (seeker_id, scholarship_id)
);

-- ===================================================================
-- NOTIFICATION SYSTEM TABLES
-- ===================================================================

-- Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('scholarship_match', 'application_update', 'session_reminder', 'system', 'promotional'),
    related_id INT,
    related_type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Notification preferences
CREATE TABLE notification_preferences (
    user_id INT PRIMARY KEY,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    scholarship_matches BOOLEAN DEFAULT TRUE,
    application_updates BOOLEAN DEFAULT TRUE,
    session_reminders BOOLEAN DEFAULT TRUE,
    promotional_emails BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ===================================================================
-- SYSTEM CONFIGURATION TABLES
-- ===================================================================

-- System settings
CREATE TABLE system_settings (
    setting_key VARCHAR(100) PRIMARY KEY,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Activity logs
CREATE TABLE activity_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- ===================================================================
-- CONTENT MANAGEMENT TABLES
-- ===================================================================

-- Blog/News articles
CREATE TABLE articles (
    article_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    content LONGTEXT,
    excerpt TEXT,
    featured_image VARCHAR(500),
    article_type ENUM('blog', 'news', 'guide', 'success_story'),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views_count INT DEFAULT 0,
    author_id INT NOT NULL,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- FAQ
CREATE TABLE faqs (
    faq_id INT PRIMARY KEY AUTO_INCREMENT,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    views_count INT DEFAULT 0,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- ===================================================================
-- INDEXES FOR PERFORMANCE
-- ===================================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Scholarship indexes
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_category ON scholarships(category_id);
CREATE INDEX idx_scholarships_organization ON scholarships(organization_id);
CREATE INDEX idx_scholarships_deadline ON scholarships(application_deadline);
CREATE INDEX idx_scholarships_featured ON scholarships(featured);
CREATE INDEX idx_scholarships_created_at ON scholarships(created_at);

-- Application indexes
CREATE INDEX idx_applications_seeker ON scholarship_applications(seeker_id);
CREATE INDEX idx_applications_scholarship ON scholarship_applications(scholarship_id);
CREATE INDEX idx_applications_status ON scholarship_applications(application_status);
CREATE INDEX idx_applications_submitted ON scholarship_applications(submitted_at);

-- Message indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Notification indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Activity log indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- ===================================================================
-- INITIAL DATA INSERTS
-- ===================================================================

-- Insert default scholarship categories
INSERT INTO scholarship_categories (name, description) VALUES
('Academic Excellence', 'Scholarships based on academic achievements'),
('Financial Need', 'Scholarships for students with financial constraints'),
('Sports', 'Athletic scholarships for sports achievements'),
('Arts & Culture', 'Scholarships for arts, music, and cultural activities'),
('STEM', 'Science, Technology, Engineering, and Mathematics scholarships'),
('International Students', 'Scholarships specifically for international students'),
('Undergraduate', 'Scholarships for undergraduate degree programs'),
('Graduate', 'Scholarships for graduate and postgraduate programs'),
('Research', 'Research-based scholarships and grants'),
('Community Service', 'Scholarships for community service and volunteering');

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('site_name', 'Scholarship Connection Platform', 'string', 'Website name'),
('max_applications_per_user', '10', 'number', 'Maximum applications per user per month'),
('email_verification_required', 'true', 'boolean', 'Require email verification for new accounts'),
('auto_match_enabled', 'true', 'boolean', 'Enable automatic scholarship matching'),
('guest_search_limit', '5', 'number', 'Daily search limit for guest users'),
('maintenance_mode', 'false', 'boolean', 'Enable maintenance mode');

-- Insert sample FAQ
INSERT INTO faqs (question, answer, category, display_order, created_by) VALUES
('How do I register for an account?', 'Click on the "Sign Up" button and fill in your details. You will need to verify your email address.', 'Registration', 1, 1),
('How can I search for scholarships?', 'Use our search function with filters like country, field of study, and scholarship type to find relevant opportunities.', 'Search', 2, 1),
('Is the service free?', 'Basic features are free. Premium counseling services may have associated fees.', 'Pricing', 3, 1),
('How do I contact a counselor?', 'Once registered, you can request counseling services and will be assigned a qualified staff member.', 'Counseling', 4, 1);

-- ===================================================================
-- END OF DATABASE SCHEMA
-- ===================================================================