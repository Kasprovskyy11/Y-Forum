<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Obsługa preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// DODAJ DEBUG:
error_log("=== LOGOWANIE ===");
error_log("POST data: " . print_r($_POST, true));
error_log("Raw input: " . file_get_contents("php://input"));

// SPRÓBUJ ODEBRAĆ DANE NA 2 SPOSOBY:
$login = "";
$password = "";

// 1. Spróbuj z $_POST (formData)
if (!empty($_POST['login'])) {
    $login = $_POST['login'];
    $password = $_POST['password'];
    error_log("Dane z $_POST - Login: '$login'");
} 
// 2. Spróbuj z JSON
else {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data) {
        $login = $data["login"] ?? "";
        $password = $data["password"] ?? "";
        error_log("Dane z JSON - Login: '$login'");
    }
}

// ====== Konfiguracja bazy ======
include 'dane_do_bazy.php';

// ====== Połączenie PDO ======
try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    error_log("Błąd PDO: " . $e->getMessage());
    echo json_encode(["success" => 0, "admin" => 0, "error" => "db_connection"]);
    exit;
}

if (!$login || !$password) {
    error_log("Brak loginu lub hasła po obu metodach");
    echo json_encode(["success" => 0, "admin" => 0, "error" => "empty_fields"]);
    exit;
}

// ====== Zapytanie do bazy ======
$stmt = $pdo->prepare("
    SELECT password, is_admin
    FROM users
    WHERE name = ?
    LIMIT 1
");
$stmt->execute([$login]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    error_log("Nie znaleziono usera: '$login'");
    echo json_encode(["success" => 0, "admin" => 0, "error" => "user_not_found"]);
    exit;
}


// ====== Sprawdzenie hasła ======
if (password_verify($password, $user["password"])) {
    error_log("Hasło OK!");
    echo json_encode([
        "success" => 1,
        "admin" => (int)$user["is_admin"]
    ]);
} else {
    error_log("Hasło NIE PASUJE!");
    echo json_encode([
        "success" => 0,
        "admin" => 0,
        "error" => "wrong_password"
    ]);
}