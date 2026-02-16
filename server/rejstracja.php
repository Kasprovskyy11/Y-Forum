<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// ====== konfiguracja bazy ======
include 'dane_do_bazy.php';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => 0]);
    exit;
}

// ====== dane z Reacta ======
$data = json_decode(file_get_contents("php://input"), true);

$email       = $data["email"] ?? "";
$password    = $data["password"] ?? "";
$birthDate   = $data["birthDate"] ?? "";
$login       = $data["login"] ?? "";         // to idzie do kolumny name
$displayName = $data["displayName"] ?? "";   // to idzie do kolumny username

// ====== walidacja ======
if (!$email || !$password || !$birthDate || !$login || !$displayName) {
    echo json_encode(["success" => 0]);
    exit;
}

// ====== sprawdzenie czy login lub email już istnieje ======
$stmt = $pdo->prepare("
    SELECT name FROM users
    WHERE name = ? OR email = ?
    LIMIT 1
");
$stmt->execute([$login, $email]);

if ($stmt->fetch()) {
    echo json_encode(["success" => 0]); // użytkownik istnieje
    exit;
}

// ====== hash hasła ======
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// ====== dodanie użytkownika ======
$stmt = $pdo->prepare("
    INSERT INTO users
    (name, username, email, passworld, birth_date, register_date, is_admin)
    VALUES (?, ?, ?, ?, ?, CURDATE(), 0)
");

$success = $stmt->execute([
    $login,        // name = login
    $displayName,  // username = wyświetlana nazwa
    $email,
    $hashedPassword,
    $birthDate
]);

if ($success) {
    echo json_encode(["success" => 1]);
} else {
    echo json_encode(["success" => 0]);
}
