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
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

// ===== pobranie ID z Reacta =====
$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["error" => "No ID provided"]);
    exit;
}

// ===== zapytanie =====
$stmt = $pdo->prepare("
    SELECT 
        p.id_p AS id,
        u.name AS name,
        u.username AS username,
        u.profilowe AS profilePhoto,
        p.text,
        p.date,
        p.likes,
        i.path AS photo,
        p.temat
    FROM posts p
    JOIN users u ON p.name = u.name
    LEFT JOIN images i ON p.image_id = i.id_image
    WHERE p.id_p = ?
    LIMIT 1
");

$stmt->execute([$id]);
$post = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$post) {
    echo json_encode(["error" => "Post not found"]);
    exit;
}

echo json_encode([
    "id" => (int)$post["id"],
    "name" => $post["name"],
    "username" => $post["username"],
    "date" => $post["date"],
    "text" => $post["text"],
    "profilePhoto" => $post["profilePhoto"],
    "photo" => $post["photo"],
    "likes" => (int)$post["likes"],
    "temat" => $post["temat"]
]);
