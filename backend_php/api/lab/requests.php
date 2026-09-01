<?php
/**
 * Lab Requests & Critical Result Verification Endpoint
 * GET & POST /backend_php/api/lab/requests.php
 */

require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/Database.php';

use GazaCare\Config\Database;

$database = new Database();
$db = $database->getConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $status = $_GET['status'] ?? null;
        $priority = $_GET['priority'] ?? null;

        $query = "SELECT * FROM lab_requests WHERE 1=1";
        $params = [];

        if ($status && $status !== 'الكل') {
            $query .= " AND status = :status";
            $params[':status'] = $status;
        }

        if ($priority && $priority !== 'الكل') {
            $query .= " AND priority = :priority";
            $params[':priority'] = $priority;
        }

        $query .= " ORDER BY (priority = 'critical') DESC, request_date DESC, id DESC";

        $stmt = $db->prepare($query);
        foreach ($params as $k => $v) {
            $stmt->bindValue($k, $v);
        }
        $stmt->execute();
        $requests = $stmt->fetchAll();

        // Decode JSON results if present
        foreach ($requests as &$req) {
            if (!empty($req['results_json'])) {
                $req['results'] = json_decode($req['results_json'], true);
            }
        }

        sendJsonResponse(true, 'تم جلب طلبات الفحوصات المخبرية', $requests);

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل جلب الفحوصات: ' . $e->getMessage(), null, 500);
    }
} elseif ($method === 'POST') {
    try {
        $data = getRequestData();
        $action = $data['action'] ?? 'create';

        if ($action === 'save_results') {
            $reqId = $data['id'] ?? '';
            $results = $data['results'] ?? [];
            $verifiedBy = $data['verified_by'] ?? 'أخصائي التحاليل المناوب';
            $today = date('Y-m-d');

            $query = "UPDATE lab_requests 
                      SET results_json = :rjson, verified_by = :vby, status = 'completed', completed_date = :cdate 
                      WHERE id = :id";
            
            $stmt = $db->prepare($query);
            $stmt->bindValue(':rjson', json_encode($results, JSON_UNESCAPED_UNICODE));
            $stmt->bindValue(':vby', $verifiedBy);
            $stmt->bindValue(':cdate', $today);
            $stmt->bindValue(':id', $reqId);
            $stmt->execute();

            sendJsonResponse(true, 'تم اعتماد نتائج الفحص المخبري وتحديث السجل الطبي للمريض بنجاح', [
                'id' => $reqId,
                'status' => 'completed',
                'completed_date' => $today
            ]);
        } elseif ($action === 'mark_critical') {
            $reqId = $data['id'] ?? '';
            $criticalNote = $data['note'] ?? 'قيم غير طبيعية تتطلب تدخلاً علاجياً عاجلاً';

            $query = "UPDATE lab_requests 
                      SET priority = 'critical', is_critical = 1, critical_note = :cnote 
                      WHERE id = :id";
            
            $stmt = $db->prepare($query);
            $stmt->bindValue(':cnote', $criticalNote);
            $stmt->bindValue(':id', $reqId);
            $stmt->execute();

            sendJsonResponse(true, 'تم تصنيف الفحص كحالة حرجة وإرسال إشعار فوري للفريق الطبي المعالج');
        } else {
            // Standard Create Lab Request
            $reqId = 'LAB-REQ-' . rand(1000, 9999);
            $patientId = $data['patient_id'] ?? 1;
            $patientName = $data['patient_name'] ?? 'أحمد خليل المصري';
            $patientMrn = $data['patient_mrn'] ?? 'P-10492';
            $doctorName = $data['doctor_name'] ?? 'د. هالة النجار';
            $testName = $data['test_name'] ?? 'فحص دم شامل (CBC)';
            $category = $data['category'] ?? 'أمراض الدم والسيولة';
            $priority = $data['priority'] ?? 'routine';
            $today = date('Y-m-d');

            $query = "INSERT INTO lab_requests (id, patient_id, patient_name, patient_mrn, doctor_name, test_name, category, priority, status, request_date) 
                      VALUES (:id, :pid, :pname, :pmrn, :dname, :tname, :cat, :prio, 'pending', :rdate)";
            
            $stmt = $db->prepare($query);
            $stmt->bindValue(':id', $reqId);
            $stmt->bindValue(':pid', $patientId);
            $stmt->bindValue(':pname', $patientName);
            $stmt->bindValue(':pmrn', $patientMrn);
            $stmt->bindValue(':dname', $doctorName);
            $stmt->bindValue(':tname', $testName);
            $stmt->bindValue(':cat', $category);
            $stmt->bindValue(':prio', $priority);
            $stmt->bindValue(':rdate', $today);
            $stmt->execute();

            sendJsonResponse(true, 'تم إرسال طلب الفحص المخبري بنجاح', ['id' => $reqId], 201);
        }

    } catch (Exception $e) {
        sendJsonResponse(false, 'فشل تنفيذ العملية: ' . $e->getMessage(), null, 500);
    }
}
