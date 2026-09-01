<?php
/**
 * User Registration Endpoint
 * POST /backend_php/api/auth/register.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';

use GazaCare\Config\Database;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(false, 'طريقة الطلب غير مسموح بها. يجب استخدام POST', null, 405);
}

$data = getRequestData();
$fullName = trim($data['fullName'] ?? $data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$phone = trim($data['phone'] ?? '');
$nationalId = trim($data['nationalId'] ?? '');
$role = strtoupper(trim($data['role'] ?? 'PATIENT'));

if (empty($fullName) || empty($email) || empty($password)) {
    sendJsonResponse(false, 'الاسم الكامل، البريد الإلكتروني وكلمة المرور مطلوبة', null, 400);
}

// Validate Role
$allowedRoles = ['PATIENT', 'DOCTOR', 'HOSPITAL_MANAGER', 'LAB_ANALYST'];
if (!in_array($role, $allowedRoles)) {
    $role = 'PATIENT';
}

$database = new Database();
$db = $database->getConnection();

try {
    // Check if email or national ID already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(':email', $email);
    $checkStmt->execute();

    if ($checkStmt->rowCount() > 0) {
        sendJsonResponse(false, 'البريد الإلكتروني مسجل مسبقاً في النظام', null, 409);
    }

    // Hash Password
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    $insertQuery = "INSERT INTO users (full_name, email, password_hash, phone, national_id, role, avatar, status) 
                    VALUES (:name, :email, :pass, :phone, :nid, :role, :avatar, 'active')";
    
    $stmt = $db->prepare($insertQuery);
    $stmt->bindParam(':name', $fullName);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':pass', $passwordHash);
    $stmt->bindParam(':phone', $phone);
    $stmt->bindParam(':nid', $nationalId);
    $stmt->bindParam(':role', $role);
    $stmt->bindParam(':avatar', $avatar);
    $stmt->execute();

    $newUserId = $db->lastInsertId();

    // If patient, create initial patient record
    if ($role === 'PATIENT') {
        $mrn = 'P-' . rand(10000, 99999);
        $patientQuery = "INSERT INTO patients (user_id, mrn, full_name, national_id, dob, gender, blood_group, phone, city) 
                         VALUES (:uid, :mrn, :name, :nid, '1995-01-01', 'ذكر', 'O+', :phone, 'غزة')";
        $pStmt = $db->prepare($patientQuery);
        $pStmt->bindParam(':uid', $newUserId);
        $pStmt->bindParam(':mrn', $mrn);
        $pStmt->bindParam(':name', $fullName);
        $pStmt->bindParam(':nid', $nationalId);
        $pStmt->bindParam(':phone', $phone);
        $pStmt->execute();
    }

    $token = 'gazacare_' . bin2hex(random_bytes(24)) . '_' . time();

    sendJsonResponse(true, 'تم إنشاء الحساب بنجاح في منظومة غزة كير', [
        'user' => [
            'id' => (int)$newUserId,
            'name' => $fullName,
            'email' => $email,
            'phone' => $phone,
            'role' => $role,
            'avatar' => $avatar
        ],
        'token' => $token
    ], 201);

} catch (Exception $e) {
    sendJsonResponse(false, 'حدث خطأ في إنشاء الحساب: ' . $e->getMessage(), null, 500);
}
