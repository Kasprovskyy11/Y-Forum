<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

include 'dane_do_bazy.php';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => "DB connection failed"]);
    exit;
}

/* ====== DANE Z FORMDATA ====== */
$email      = $_POST['email'] ?? '';
$password   = $_POST['password'] ?? '';
$birthDate  = $_POST['birth_date'] ?? '';
$name       = $_POST['name'] ?? '';       // display name
$username   = $_POST['username'] ?? '';   // login

if (!$email || !$password || !$birthDate || !$name || !$username) {
    echo json_encode(["success" => false, "error" => "Missing fields"]);
    exit;
}

/* ====== SPRAWDZENIE CZY ISTNIEJE ====== */
$stmt = $pdo->prepare("
    SELECT name FROM users
    WHERE name = ? OR email = ?
    LIMIT 1
");
$stmt->execute([$username, $email]);

if ($stmt->fetch()) {
    echo json_encode(["success" => false, "error" => "User already exists"]);
    exit;
}

/* ====== HASŁO ====== */
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

/* ====== ZDJĘCIE (opcjonalne) ====== */
$photoPath = "/";
if (!empty($_FILES['profilowe']['name'])) {
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $fileName = uniqid() . "_" . basename($_FILES['profilowe']['name']);
    $target = $uploadDir . $fileName;

    if (move_uploaded_file($_FILES['profilowe']['tmp_name'], $target)) {
        $photoPath = $target;
    }
}

/* ====== INSERT ====== */
$stmt = $pdo->prepare("
    INSERT INTO users
    (name, username, email, password, birth_date, profilowe, register_date, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 0)
");

$success = $stmt->execute([
    $name,
    $username,
    $email,
    $hashedPassword,
    $birthDate,
    $photoPath
]);

echo json_encode(["success" => $success]);