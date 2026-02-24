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

// ===== dane z Reacta =====
$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["success" => 0, "error" => "No ID provided"]);
    exit;
}

// ===== sprawdzenie czy post istnieje =====
$stmt = $pdo->prepare("
    SELECT image_id 
    FROM posts 
    WHERE id_p = ?
    LIMIT 1
");
$stmt->execute([$id]);
$post = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$post) {
    echo json_encode(["success" => 0, "error" => "Post not found"]);
    exit;
}

$imageId = $post["image_id"];

// ===== usunięcie posta =====
$stmt = $pdo->prepare("DELETE FROM posts WHERE id_p = ?");
$stmt->execute([$id]);

// ===== jeśli było zdjęcie =====
if ($imageId) {

    // pobranie ścieżki
    $stmt = $pdo->prepare("SELECT path FROM images WHERE id_image = ?");
    $stmt->execute([$imageId]);
    $image = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($image) {
        $filePath = $image["path"];

        // usunięcie pliku z serwera (jeśli istnieje)
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        // usunięcie rekordu z images
        $stmt = $pdo->prepare("DELETE FROM images WHERE id_image = ?");
        $stmt->execute([$imageId]);
    }
}

echo json_encode(["success" => 1]);