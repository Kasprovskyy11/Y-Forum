<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// Obsługa preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ====== konfiguracja bazy ======
include 'dane_do_bazy.php';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "Database connection failed"]);
    exit;
}

// ====== dane z Reacta (FormData) ======
$email       = $_POST['email'] ?? "";
$password    = $_POST['password'] ?? "";
$birthDate   = $_POST['birth_date'] ?? "";  // birth_date w FormData
$name        = $_POST['name'] ?? "";        // wyświetlana nazwa
$username    = $_POST['username'] ?? "";     // login

// ====== walidacja ======
if (!$email || !$password || !$birthDate || !$name || !$username) {
    echo json_encode(["success" => false, "error" => "All fields are required"]);
    exit;
}

// ====== sprawdzenie czy login lub email już istnieje ======
$stmt = $pdo->prepare("
    SELECT username FROM users
    WHERE username = ? OR email = ?
    LIMIT 1
");
$stmt->execute([$username, $email]);

if ($stmt->fetch()) {
    echo json_encode(["success" => false, "error" => "User already exists"]);
    exit;
}

// ====== hash hasła ======
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// ====== dodanie użytkownika ======
$stmt = $pdo->prepare("
    INSERT INTO users
    (name, username, email, password, birth_date, register_date, is_admin)
    VALUES (?, ?, ?, ?, ?, CURDATE(), 0)
");

try {
    $success = $stmt->execute([
        $name,        // name = wyświetlana nazwa
        $username,    // username = login
        $email,
        $hashedPassword,
        $birthDate
    ]);
    
    if ($success) {
        echo json_encode(["success" => true, "message" => "Registration successful"]);
    } else {
        echo json_encode(["success" => false, "error" => "Registration failed"]);
    }
} catch (PDOException $e) {
    // To pomoże zdiagnozować problemy z bazą danych
    echo json_encode([
        "success" => false, 
        "error" => "Database error: " . $e->getMessage()
    ]);
}
?>