<?php
/**
 * Electronic Prescriptions Endpoint
 * GET & POST /backend_php/api/prescriptions/index.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';

use GazaCare\Config\Database;

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $patientId = $_GET['patient_id'] ?? null;
        $query = "SELECT pr.*, p.full_name as patientName, p.mrn as patientMrn, d.full_name as doctorName, d.specialty 
                  FROM prescriptions pr 
                  JOIN patients p ON pr.patient_id = p.id 
                  JOIN doctors d ON pr.doctor_id = d.id 
                  WHERE 1=1";
        
        $params = [];
        if ($patientId) {
            $query .= " AND pr.patient_id = :pid";
            $params[':pid'] = $patientId;
        }

        $query .= " ORDER BY pr.prescribed_date DESC";
        $stmt = $db->prepare($query);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $prescriptions = $stmt->fetchAll();

        foreach ($prescriptions as &$rx) {
            if (!empty($rx['items_json'])) {
                $rx['medications'] = json_decode($rx['items_json'], true);
            }
        }

        sendJsonResponse(true, 'تم جلب الوصفات الطبية بنجاح', $prescriptions);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل جلب الوصفات: ' . $e->getMessage(), null, 500);
    }
} elseif ($method === 'POST') {
    try {
        $data = getRequestData();
        $rxId = 'RX-' . rand(5500, 9999);
        $patientId = $data['patient_id'] ?? 1;
        $doctorId = $data['doctor_id'] ?? 1;
        $diagnosis = $data['diagnosis'] ?? 'تشخيص عام ومتابعة دورية';
        $today = date('Y-m-d');
        $qrCode = 'GAZA-EMR-RX-' . strtoupper(bin2hex(random_bytes(4)));
        $medications = $data['medications'] ?? $data['items'] ?? [];
        $instructions = $data['instructions'] ?? '';

        $query = "INSERT INTO prescriptions (id, patient_id, doctor_id, diagnosis, prescribed_date, status, qr_code, items_json, instructions) 
                  VALUES (:id, :pid, :did, :diag, :pdate, 'نشطة', :qr, :items, :inst)";
        
        $stmt = $db->prepare($query);
        $stmt->bindValue(':id', $rxId);
        $stmt->bindValue(':pid', $patientId);
        $stmt->bindValue(':did', $doctorId);
        $stmt->bindValue(':diag', $diagnosis);
        $stmt->bindValue(':pdate', $today);
        $stmt->bindValue(':qr', $qrCode);
        $stmt->bindValue(':items', json_encode($medications, JSON_UNESCAPED_UNICODE));
        $stmt->bindValue(':inst', $instructions);
        $stmt->execute();

        sendJsonResponse(true, 'تم إصدار الوصفة الطبية الإلكترونية وتوليد رمز الصرف بنجاح', [
            'id' => $rxId,
            'qrCode' => $qrCode,
            'status' => 'نشطة',
            'date' => $today
        ], 201);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل إصدار الوصفة: ' . $e->getMessage(), null, 500);
    }
}
