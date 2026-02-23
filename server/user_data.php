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

// ===== pobranie loginu z Reacta =====
$data = json_decode(file_get_contents("php://input"), true);
$name = $data["name"] ?? null;   // login użytkownika

if (!$name) {
    echo json_encode(["error" => "No user provided"]);
    exit;
}

// ===== pobranie danych użytkownika =====
$stmt = $pdo->prepare("
    SELECT name, username, profilowe, birth_date
    FROM users
    WHERE name = ?
    LIMIT 1
");

$stmt->execute([$name]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

// ===== pobranie postów użytkownika =====
$stmt = $pdo->prepare("
    SELECT 
        p.id_p AS id,
        p.text,
        p.date,
        p.likes,
        p.temat,
        i.path AS photo
    FROM posts p
    LEFT JOIN images i ON p.image_id = i.id_image
    WHERE p.name = ?
    ORDER BY p.date DESC
");

$stmt->execute([$name]);

$posts = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $posts[] = [
        "id" => (int)$row["id"],
        "name" => $user["name"],                   // login autora
        "username" => $user["username"],           // wyświetlana nazwa
        "profilePhoto" => $user["profilowe"],      // profilowe autora
        "date" => $row["date"],
        "text" => $row["text"],
        "photo" => $row["photo"],
        "likes" => (int)$row["likes"],
        "temat" => $row["temat"]
    ];
}
// ===== zwrot danych =====
echo json_encode([
    "name" => $user["name"],
    "username" => $user["username"],
    "profilePicture" => $user["profilowe"],
    "birth_date" => $user["birth_date"],
    "posts" => $posts
]);