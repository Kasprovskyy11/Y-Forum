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

// ===== pobranie danych (obsługa multipart/form-data przez $_POST/$_FILES) =====
$name      = $_POST['name'] ?? null;        // login
$temat     = $_POST['temat'] ?? null;
$text      = $_POST['text'] ?? null;

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

// ===== obsługa zdjęcia (plik przesłany jako multipart/form-data pod kluczem 'file') =====
$imageId = null;
$photoPath = null;
if (!empty($_FILES['file']) && isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/posts';
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    $tmpName = $_FILES['file']['tmp_name'];
    $origName = basename($_FILES['file']['name']);
    $ext = pathinfo($origName, PATHINFO_EXTENSION);
    $safeBase = preg_replace('/[^A-Za-z0-9_\-]/', '_', pathinfo($origName, PATHINFO_FILENAME));
    $newName = $safeBase . '_' . time() . ($ext ? '.' . $ext : '');
    $targetPath = $uploadDir . '/' . $newName;

    if (move_uploaded_file($tmpName, $targetPath)) {
        $photoPath = 'posts/' . $newName;
        $stmt = $pdo->prepare("
            INSERT INTO images (name, path)
            VALUES (?, ?)
        ");
        $stmt->execute([$temat, $photoPath]);
        $imageId = $pdo->lastInsertId();
    } else {
        echo json_encode(["success" => 0, "error" => "Upload failed"]);
        exit;
    }
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