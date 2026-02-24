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
$photoPath = null; // jebane null, żeby nie wpierdoliło DB jeśli brak zdjęcia
if (!empty($_FILES['profilowe']['name'])) {
    $uploadDir = "uploads/";  // folder gdzie będą zdjęcia
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // tworzymy folder jak nie ma
    }

    // Pobieramy rozszerzenie pliku
    $ext = pathinfo($_FILES['profilowe']['name'], PATHINFO_EXTENSION);

    // Tworzymy nazwę pliku taka jak login użytkownika + oryginalne rozszerzenie
    $fileName = $name . '.' . $ext;

    $target = $uploadDir . $fileName;

    // Zapis pliku na serwerze
    if (move_uploaded_file($_FILES['profilowe']['tmp_name'], $target)) {
        $photoPath = $target; // jebane path do DB
    }
}

/* ====== INSERT ====== */
$stmt = $pdo->prepare("
    INSERT INTO users
    (name, username, email, password, birth_date, profilowe, register_date, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 0)
");

$success = $stmt->execute([
    $name,        // unikalny login
    $username,    // wyświetlana nazwa
    $email,
    $hashedPassword,
    $birthDate,
    $photoPath
]);

echo json_encode(["success" => $success]);