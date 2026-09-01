<?php
/**
 * Hospital Beds & Occupancy Management Endpoint
 * GET & PUT /backend_php/api/beds/index.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';

use GazaCare\Config\Database;

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $department = $_GET['department'] ?? null;
        $status = $_GET['status'] ?? null;

        $query = "SELECT * FROM beds WHERE 1=1";
        $params = [];

        if ($department && $department !== 'الكل') {
            $query .= " AND department_name = :dept";
            $params[':dept'] = $department;
        }

        if ($status && $status !== 'الكل') {
            $query .= " AND status = :status";
            $params[':status'] = $status;
        }

        $query .= " ORDER BY department_name, room_number, bed_number";

        $stmt = $db->prepare($query);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $beds = $stmt->fetchAll();

        sendJsonResponse(true, 'تم جلب بيانات الأسرة السريرية بنجاح', $beds);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل جلب الأسرة: ' . $e->getMessage(), null, 500);
    }
} elseif ($method === 'PUT' || $method === 'POST') {
    try {
        $data = getRequestData();
        $bedId = $data['id'] ?? '';
        $newStatus = $data['status'] ?? 'available';
        $patientName = $data['patientName'] ?? null;
        $doctorName = $data['doctor'] ?? null;

        if (empty($bedId)) {
            sendJsonResponse(false, 'معرّف السرير مطلوب', null, 400);
        }

        if ($newStatus === 'available') {
            $query = "UPDATE beds 
                      SET status = 'available', patient_id = NULL, patient_name = NULL, doctor_name = NULL, admitted_at = NULL 
                      WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindValue(':id', $bedId);
        } else {
            $query = "UPDATE beds 
                      SET status = :status, patient_name = :pname, doctor_name = :dname, admitted_at = NOW() 
                      WHERE id = :id";
            $stmt = $db->prepare($query);
            $stmt->bindValue(':status', $newStatus);
            $stmt->bindValue(':pname', $patientName);
            $stmt->bindValue(':dname', $doctorName);
            $stmt->bindValue(':id', $bedId);
        }

        $stmt->execute();

        sendJsonResponse(true, 'تم تحديث حالة السرير السريري بنجاح', [
            'id' => $bedId,
            'status' => $newStatus
        ]);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل تحديث السرير: ' . $e->getMessage(), null, 500);
    }
}
