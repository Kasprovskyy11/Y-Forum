<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include 'dane_do_bazy.php';

try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    echo json_encode([]);
    exit;
}

$stmt = $pdo->query("
    SELECT 
        u.name AS name,
        u.username AS username,
        u.profilowe AS profilePhoto,
        p.text,
        p.date,
        p.likes,
        i.path AS photo
    FROM posts p
    JOIN users u ON p.username = u.name
    LEFT JOIN images i ON p.image_id = i.id_image
    ORDER BY p.date DESC
");

$posts = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {

    $posts[] = [
        "name" => $row["name"],                      // login
        "username" => $row["username"],              // wyświetlana nazwa
        "date" => $row["date"],
        "text" => $row["text"],
        "profilePhoto" => $row["profilePhoto"],      // zdjęcie profilowe
        "photo" => $row["photo"],
        "likes" => (int)$row["likes"]
    ];
}

echo json_encode($posts);
