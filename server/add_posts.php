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
    echo json_encode(["success" => 0, "error" => "DB connection failed"]);
    exit;
}

// ===== pobranie danych =====
$data = json_decode(file_get_contents("php://input"), true);

$name      = $data["name"] ?? null;        // login
$photoPath = $data["photoPath"] ?? null;  // opcjonalne
$temat     = $data["temat"] ?? null;
$text      = $data["text"] ?? null;

if (!$name || !$temat || !$text) {
    echo json_encode(["success" => 0, "error" => "Missing data"]);
    exit;
}

// ===== pobranie username z users =====
$stmt = $pdo->prepare("
    SELECT username 
    FROM users 
    WHERE name = ?
    LIMIT 1
");
$stmt->execute([$name]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["success" => 0, "error" => "User not found"]);
    exit;
}

$username = $user["username"];

// ===== obsługa zdjęcia =====
$imageId = null;

if ($photoPath) {
    $stmt = $pdo->prepare("
        INSERT INTO images (name, path)
        VALUES (?, ?)
    ");
    $stmt->execute([$temat, $photoPath]);

    $imageId = $pdo->lastInsertId();
}

// ===== dodanie posta =====
$stmt = $pdo->prepare("
    INSERT INTO posts
    (name, username, image_id, text, likes, date, temat)
    VALUES (?, ?, ?, ?, 0, CURDATE(), ?)
");

$stmt->execute([
    $name,
    $username,
    $imageId,
    $text,
    $temat
]);

$postId = $pdo->lastInsertId();

echo json_encode([
    "success" => 1,
    "postId" => (int)$postId
]);