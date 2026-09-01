-- ==========================================================
-- GazaCare EMR Database Schema (MySQL 8.0+ / MariaDB 10.4+)
-- Encoding: utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `gazacare_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `gazacare_db`;

-- ----------------------------------------------------------
-- 1. Table: Users (المستخدمون والحسابات)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `national_id` VARCHAR(20) NULL UNIQUE,
    `role` ENUM('PATIENT', 'DOCTOR', 'HOSPITAL_MANAGER', 'LAB_ANALYST', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    `hospital_id` INT NULL,
    `avatar` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. Table: Hospitals (المستشفيات والمراكز الصحية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hospitals` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `city` VARCHAR(80) NOT NULL DEFAULT 'غزة',
    `address` VARCHAR(255) NULL,
    `phone` VARCHAR(30) NULL,
    `total_beds` INT NOT NULL DEFAULT 100,
    `available_beds` INT NOT NULL DEFAULT 20,
    `icu_beds` INT NOT NULL DEFAULT 10,
    `available_icu_beds` INT NOT NULL DEFAULT 2,
    `emergency_capacity` INT NOT NULL DEFAULT 50,
    `oxygen_level_pct` INT NOT NULL DEFAULT 85,
    `blood_bank_units` INT NOT NULL DEFAULT 120,
    `status` ENUM('operational', 'critical_shortage', 'offline') DEFAULT 'operational',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. Table: Departments (الأقسام الطبية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `departments` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `hospital_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `head_doctor` VARCHAR(150) NULL,
    `total_beds` INT NOT NULL DEFAULT 20,
    `occupied_beds` INT NOT NULL DEFAULT 15,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. Table: Patients (سجلات المرضى)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `patients` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `mrn` VARCHAR(30) NOT NULL UNIQUE, -- Medical Record Number
    `full_name` VARCHAR(150) NOT NULL,
    `national_id` VARCHAR(20) NOT NULL,
    `dob` DATE NOT NULL,
    `gender` ENUM('ذكر', 'أنثى') NOT NULL,
    `blood_group` VARCHAR(5) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `emergency_phone` VARCHAR(30) NULL,
    `city` VARCHAR(80) NOT NULL,
    `address` VARCHAR(255) NULL,
    `department` VARCHAR(100) NULL,
    `room_bed` VARCHAR(50) NULL,
    `allergies` TEXT NULL,
    `chronic_diseases` TEXT NULL,
    `insurance_id` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. Table: Doctors (الأطباء والاستشاريون)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `doctors` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NULL,
    `doctor_id_code` VARCHAR(30) NOT NULL UNIQUE,
    `full_name` VARCHAR(150) NOT NULL,
    `specialty` VARCHAR(100) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `hospital_id` INT NOT NULL,
    `phone` VARCHAR(30) NULL,
    `email` VARCHAR(150) NULL,
    `experience_years` INT DEFAULT 5,
    `rating` DECIMAL(2,1) DEFAULT 4.9,
    `avatar` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. Table: Beds (الأسرة وإدارة الإشغال)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `beds` (
    `id` VARCHAR(30) PRIMARY KEY, -- e.g. BED-ICU-01
    `hospital_id` INT NOT NULL,
    `department_id` INT NOT NULL,
    `department_name` VARCHAR(100) NOT NULL,
    `room_number` VARCHAR(30) NOT NULL,
    `bed_number` VARCHAR(20) NOT NULL,
    `type` ENUM('عناية مركزة', 'طوارئ', 'تنويم عام', 'عزل', 'عمليات') NOT NULL,
    `status` ENUM('available', 'occupied', 'cleaning', 'maintenance') NOT NULL DEFAULT 'available',
    `patient_id` INT NULL,
    `patient_name` VARCHAR(150) NULL,
    `doctor_name` VARCHAR(150) NULL,
    `admitted_at` DATETIME NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. Table: Appointments (المواعيد والعيادات)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `appointments` (
    `id` VARCHAR(30) PRIMARY KEY, -- e.g. APT-8001
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `hospital_id` INT NOT NULL,
    `appointment_date` DATE NOT NULL,
    `appointment_time` VARCHAR(20) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `clinic_room` VARCHAR(50) NULL,
    `type` VARCHAR(80) DEFAULT 'كشف استشاري',
    `status` ENUM('مؤكد', 'في الانتظار', 'مكتمل', 'ملغي') DEFAULT 'في الانتظار',
    `queue_number` INT NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`hospital_id`) REFERENCES `hospitals`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. Table: Prescriptions (الوصفات الطبية الإلكترونية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prescriptions` (
    `id` VARCHAR(30) PRIMARY KEY, -- e.g. RX-5521
    `patient_id` INT NOT NULL,
    `doctor_id` INT NOT NULL,
    `diagnosis` VARCHAR(255) NOT NULL,
    `prescribed_date` DATE NOT NULL,
    `status` ENUM('نشطة', 'مصروفة', 'منتهية', 'ملغاة') DEFAULT 'نشطة',
    `qr_code` VARCHAR(100) NOT NULL,
    `items_json` JSON NOT NULL, -- list of medications { name, dosage, frequency, duration, instructions }
    `instructions` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 9. Table: Lab Requests (طلبات الفحوصات المخبرية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `lab_requests` (
    `id` VARCHAR(30) PRIMARY KEY, -- e.g. LAB-REQ-1001
    `patient_id` INT NOT NULL,
    `patient_name` VARCHAR(150) NOT NULL,
    `patient_mrn` VARCHAR(30) NOT NULL,
    `doctor_id` INT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `test_name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `priority` ENUM('routine', 'urgent', 'critical') DEFAULT 'routine',
    `status` ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    `request_date` DATE NOT NULL,
    `completed_date` DATE NULL,
    `verified_by` VARCHAR(150) NULL,
    `critical_note` TEXT NULL,
    `is_critical` BOOLEAN DEFAULT FALSE,
    `results_json` JSON NULL, -- Array of results: { parameter, value, unit, reference, status, isAbnormal }
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 10. Table: Vital Signs (المؤشرات الحيوية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `vital_signs` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `recorded_at` DATETIME NOT NULL,
    `blood_pressure` VARCHAR(20) NOT NULL,
    `heart_rate` INT NOT NULL,
    `temperature` DECIMAL(4,1) NOT NULL,
    `oxygen_sat` INT NOT NULL,
    `glucose` INT NULL,
    `respiratory_rate` INT NULL,
    `notes` TEXT NULL,
    `recorded_by` VARCHAR(150) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 11. Table: Clinical Notes (الملاحظات السريرية)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinical_notes` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `patient_id` INT NOT NULL,
    `doctor_id` INT NULL,
    `doctor_name` VARCHAR(150) NOT NULL,
    `specialty` VARCHAR(100) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `content` TEXT NOT NULL,
    `note_date` DATE NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 12. Table: Radiology (الأشعة والتصوير الطبي PACS)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `radiology_records` (
    `id` VARCHAR(30) PRIMARY KEY, -- e.g. RAD-2024-01
    `patient_id` INT NOT NULL,
    `test_type` VARCHAR(150) NOT NULL,
    `body_part` VARCHAR(100) NOT NULL,
    `radiologist` VARCHAR(150) NOT NULL,
    `scan_date` DATE NOT NULL,
    `status` ENUM('مكتمل', 'مجدول', 'ملغي') DEFAULT 'مكتمل',
    `findings` TEXT NOT NULL,
    `conclusion` TEXT NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 13. Table: Notifications (الإشعارات والتنبيهات)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `target_role` ENUM('PATIENT', 'DOCTOR', 'HOSPITAL_MANAGER', 'LAB_ANALYST', 'ALL') DEFAULT 'ALL',
    `target_user_id` INT NULL,
    `type` VARCHAR(50) NOT NULL, -- critical, lab, appointment, emergency
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `link` VARCHAR(255) NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- SEED INITIAL DATA (بيانات تجريبية أولية)
-- ==========================================================

-- Hospitals
INSERT INTO `hospitals` (`id`, `name`, `city`, `address`, `total_beds`, `available_beds`, `icu_beds`, `available_icu_beds`, `oxygen_level_pct`, `blood_bank_units`, `status`) VALUES
(1, 'مجمع الشفاء الطبي', 'غزة', 'شارع الوحدة، الرمال', 450, 42, 40, 3, 78, 120, 'critical_shortage'),
(2, 'المستشفى الأندونيسي', 'شمال غزة', 'بيت لاهيا', 180, 18, 16, 1, 65, 45, 'critical_shortage'),
(3, 'مجمع ناصر الطبي', 'خانيونس', 'خانيونس المركز', 350, 56, 28, 4, 82, 95, 'operational'),
(4, 'مستشفى شهداء الأقصى', 'دير البلح', 'دير البلح - شارع صلاح الدين', 220, 24, 18, 2, 70, 60, 'critical_shortage');

-- Departments
INSERT INTO `departments` (`id`, `hospital_id`, `name`, `head_doctor`, `total_beds`, `occupied_beds`) VALUES
(1, 1, 'قسم الطوارئ والاستقبال', 'د. يوسف النجار', 60, 54),
(2, 1, 'العناية المركزة (ICU)', 'د. محمود الشوا', 40, 37),
(3, 1, 'قسم الباطنة العامة', 'د. هالة النجار', 80, 72),
(4, 1, 'قسم الجراحة العامة والعمليات', 'د. صائب العشي', 70, 65),
(5, 1, 'المختبر وبنك الدم المركزي', 'أ. طارق حسنين', 0, 0);

-- Users (Password for all: password123 -> $2y$10$wN16lqZ4852h4cO1Jm9Wn.sYJ329m6N8i4GvH614u6U2B4d0P6yF6)
INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `phone`, `national_id`, `role`, `hospital_id`) VALUES
(1, 'د. هالة النجار', 'doctor@gazacare.ps', '$2y$10$8.9P6s88.k2X8wL8Q3VnOuWkE32jY4PZ1fD5hN7gK6rT8bV4eX9qy', '+970 59 912 3456', '901234567', 'DOCTOR', 1),
(2, 'أحمد خليل المصري', 'patient@gazacare.ps', '$2y$10$8.9P6s88.k2X8wL8Q3VnOuWkE32jY4PZ1fD5hN7gK6rT8bV4eX9qy', '+970 59 123 4567', '401234567', 'PATIENT', 1),
(3, 'د. محمود الشوا', 'manager@gazacare.ps', '$2y$10$8.9P6s88.k2X8wL8Q3VnOuWkE32jY4PZ1fD5hN7gK6rT8bV4eX9qy', '+970 59 888 7766', '801234567', 'HOSPITAL_MANAGER', 1),
(4, 'أ. طارق حسنين', 'lab@gazacare.ps', '$2y$10$8.9P6s88.k2X8wL8Q3VnOuWkE32jY4PZ1fD5hN7gK6rT8bV4eX9qy', '+970 59 555 4433', '701234567', 'LAB_ANALYST', 1);

-- Doctors
INSERT INTO `doctors` (`id`, `user_id`, `doctor_id_code`, `full_name`, `specialty`, `department`, `hospital_id`, `phone`, `email`, `experience_years`, `rating`) VALUES
(1, 1, 'DOC-4091', 'د. هالة النجار', 'استشاري أمراض باطنة وسكري', 'قسم الباطنة العامة', 1, '+970 59 912 3456', 'doctor@gazacare.ps', 14, 4.9),
(2, NULL, 'DOC-4092', 'د. يوسف النجار', 'استشاري طب الطوارئ والإصابات', 'قسم الطوارئ والاستقبال', 1, '+970 59 912 8888', 'yousef@gazacare.ps', 18, 4.8),
(3, NULL, 'DOC-4093', 'د. صائب العشي', 'استشاري جراحة الأوعية والقلب', 'قسم الجراحة العامة والعمليات', 1, '+970 59 912 9999', 'saeb@gazacare.ps', 20, 5.0);

-- Patients
INSERT INTO `patients` (`id`, `user_id`, `mrn`, `full_name`, `national_id`, `dob`, `gender`, `blood_group`, `phone`, `emergency_phone`, `city`, `address`, `department`, `room_bed`, `allergies`, `chronic_diseases`) VALUES
(1, 2, 'P-10492', 'أحمد خليل المصري', '401234567', '1988-04-12', 'ذكر', 'O+', '+970 59 123 4567', '+970 59 987 6543', 'غزة', 'حي الشيخ رضوان - شارع الجلاء', 'قسم الباطنة العامة', 'الغرفة 204 - سرير 02', 'بنسلين، سلفا', 'سكري النوع الثاني، ضغط الدم');
