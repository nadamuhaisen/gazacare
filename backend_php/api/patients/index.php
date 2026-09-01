<?php
/**
 * Patients List and Filtering Endpoint
 * GET /backend_php/api/patients/index.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';

use GazaCare\Config\Database;

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(false, 'طريقة غير مسموحة', null, 405);
}

$database = new Database();
$db = $database->getConnection();

try {
    $search = trim($_GET['search'] ?? '');
    $department = trim($_GET['department'] ?? '');

    $query = "SELECT p.*, u.avatar 
              FROM patients p 
              LEFT JOIN users u ON p.user_id = u.id 
              WHERE 1=1";

    $params = [];

    if (!empty($search)) {
        $query .= " AND (p.full_name LIKE :search OR p.mrn LIKE :search OR p.national_id LIKE :search)";
        $params[':search'] = "%{$search}%";
    }

    if (!empty($department) && $department !== 'الكل') {
        $query .= " AND p.department = :dept";
        $params[':dept'] = $department;
    }

    $query .= " ORDER BY p.id DESC";

    $stmt = $db->prepare($query);
    foreach ($params as $key => $val) {
        $stmt->bindValue($key, $val);
    }
    $stmt->execute();
    $patients = $stmt->fetchAll();

    sendJsonResponse(true, 'تم جلب سجلات المرضى بنجاح', $patients);

} catch (Exception $e) {
    sendJsonResponse(false, 'فشل جلب البيانات: ' . $e->getMessage(), null, 500);
}
