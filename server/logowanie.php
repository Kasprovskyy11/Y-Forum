<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ====== Konfiguracja bazy ======
$host = "localhost";
$db   = "y_base";
$user = "root";
$pass = "";
$charset = "utf8mb4";

// ====== Połączenie PDO ======
try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => 0, "admin" => 0]);
    exit;
}

// ====== Odczyt danych z Reacta ======
$data = json_decode(file_get_contents("php://input"), true);

$login = $data["login"] ?? "";
$password = $data["password"] ?? "";

if (!$login || !$password) {
    echo json_encode(["success" => 0, "admin" => 0]);
    exit;
}

// ====== Zapytanie do bazy ======
$stmt = $pdo->prepare("
    SELECT passworld, is_admin
    FROM users
    WHERE username = ?
    LIMIT 1
");
$stmt->execute([$login]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => 0, "admin" => 0]);
    exit;
}

// ====== Sprawdzenie hasła ======
if ($password === $user["passworld"]) {
    echo json_encode([
        "success" => 1,
        "admin" => (int)$user["is_admin"]
    ]);
} else {
    echo json_encode([
        "success" => 0,
        "admin" => 0
    ]);
}
