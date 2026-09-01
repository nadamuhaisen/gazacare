<?php
/**
 * Appointments Listing and Scheduling Endpoint
 * GET & POST /backend_php/api/appointments/index.php
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
        $doctorId = $_GET['doctor_id'] ?? null;
        $status = $_GET['status'] ?? null;

        $query = "SELECT a.*, p.full_name as patientName, p.mrn as patientMrn, d.full_name as doctorName, d.specialty 
                  FROM appointments a
                  JOIN patients p ON a.patient_id = p.id
                  JOIN doctors d ON a.doctor_id = d.id
                  WHERE 1=1";

        $params = [];
        if ($patientId) {
            $query .= " AND a.patient_id = :pid";
            $params[':pid'] = $patientId;
        }
        if ($doctorId) {
            $query .= " AND a.doctor_id = :did";
            $params[':did'] = $doctorId;
        }
        if ($status && $status !== 'الكل') {
            $query .= " AND a.status = :status";
            $params[':status'] = $status;
        }

        $query .= " ORDER BY a.appointment_date DESC, a.appointment_time ASC";

        $stmt = $db->prepare($query);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $appointments = $stmt->fetchAll();

        sendJsonResponse(true, 'تم جلب المواعيد بنجاح', $appointments);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل جلب المواعيد: ' . $e->getMessage(), null, 500);
    }
} elseif ($method === 'POST') {
    try {
        $data = getRequestData();
        $patientId = $data['patient_id'] ?? 1;
        $doctorId = $data['doctor_id'] ?? 1;
        $hospitalId = $data['hospital_id'] ?? 1;
        $appointmentDate = $data['date'] ?? $data['appointment_date'] ?? date('Y-m-d');
        $appointmentTime = $data['time'] ?? $data['appointment_time'] ?? '10:00 ص';
        $department = $data['department'] ?? 'قسم الباطنة العامة';
        $type = $data['type'] ?? 'كشف استشاري';
        $notes = $data['notes'] ?? '';

        $aptId = 'APT-' . rand(8000, 9999);
        $queueNumber = rand(1, 20);

        $query = "INSERT INTO appointments (id, patient_id, doctor_id, hospital_id, appointment_date, appointment_time, department, type, status, queue_number, notes) 
                  VALUES (:id, :pid, :did, :hid, :adate, :atime, :dept, :type, 'في الانتظار', :qnum, :notes)";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':id', $aptId);
        $stmt->bindParam(':pid', $patientId);
        $stmt->bindParam(':did', $doctorId);
        $stmt->bindParam(':hid', $hospitalId);
        $stmt->bindParam(':adate', $appointmentDate);
        $stmt->bindParam(':atime', $appointmentTime);
        $stmt->bindParam(':dept', $department);
        $stmt->bindParam(':type', $type);
        $stmt->bindParam(':qnum', $queueNumber);
        $stmt->bindParam(':notes', $notes);
        $stmt->execute();

        sendJsonResponse(true, 'تم حجز الموعد بنجاح وهو قيد التأكيد', [
            'id' => $aptId,
            'appointment_date' => $appointmentDate,
            'appointment_time' => $appointmentTime,
            'status' => 'في الانتظار',
            'queue_number' => $queueNumber
        ], 201);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل حجز الموعد: ' . $e->getMessage(), null, 500);
    }
} else {
    sendJsonResponse(false, 'طريقة غير مسموحة', null, 405);
}
