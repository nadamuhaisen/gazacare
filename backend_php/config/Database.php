<?php
/**
 * GazaCare Database Connection Class (PDO)
 * Pure PHP 8.0+ / MySQL
 */

namespace GazaCare\Config;

use PDO;
use PDOException;

class Database {
    private string $host = '127.0.0.1';
    private string $db_name = 'gazacare_db';
    private string $username = 'root';
    private string $password = '';
    private string $charset = 'utf8mb4';
    private ?PDO $conn = null;

    public function __construct() {
        // Read environment variables if available
        if (getenv('DB_HOST')) $this->host = getenv('DB_HOST');
        if (getenv('DB_NAME')) $this->db_name = getenv('DB_NAME');
        if (getenv('DB_USER')) $this->username = getenv('DB_USER');
        if (getenv('DB_PASS')) $this->password = getenv('DB_PASS');
    }

    public function getConnection(): ?PDO {
        $this->conn = null;
        $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset={$this->charset}";

        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $exception) {
            // Return JSON error if database connection fails
            http_response_code(500);
            header('Content-Type: application/json; charset=utf-8');
            echo json_encode([
                'success' => false,
                'message' => 'Database connection failed: ' . $exception->getMessage()
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        return $this->conn;
    }
}
