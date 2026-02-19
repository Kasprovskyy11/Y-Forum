<?php
/**
 * UPLOAD OBRAZÓW - API dla React
 * 
 * WYMAGANIA:
 * - PHP 7.4+
 * - Rozszerzenie GD (włączone w php.ini: extension=gd)
 * - Folder uploads/posts/ z prawami zapisu (755)
 * - Baza danych z tabelą 'images' (patrz: create_table.sql)
 * 
 * KONFIGURACJA:
 * 1. Dostosuj ustawienia CORS w sekcji poniżej
 * 2. Skonfiguruj połączenie z bazą w pliku db.php
 * 3. Ustaw odpowiednie limity w sekcji USTAWIENIA
 * 
 * UŻYCIE Z REACT:
 * const formData = new FormData();
 * formData.append('image', fileInput.files[0]);
 * const response = await fetch('upload_post_img.php', {
 *   method: 'POST',
 *   body: formData
 * });
 * const data = await response.json();
 */

// Wyłącz wyświetlanie błędów, aby nie psuły JSONa
error_reporting(0);
ini_set('display_errors', 0);

// ==================== CORS - NAGŁÓWKI DLA REACT ====================
// UWAGA: Zmień '*' na konkretną domenę React w produkcji (np. 'https://twoja-domena.pl')
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Obsługa preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Tylko metoda POST jest dozwolona
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda niedozwolona. Użyj POST.']);
    exit;
}

// ==================== POŁĄCZENIE Z BAZĄ DANYCH ====================
try {
    require_once 'dane_do_bazy.php'; // Konfiguracja bazy: host, user, password, dbname
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd połączenia z bazą: ' . $e->getMessage()]);
    exit;
}

// ==================== USTAWIENIA ====================
$uploadDirBase = __DIR__ . '/uploads/posts/';  // Ścieżka do zapisu obrazów
$maxFileSize   = 3 * 1024 * 1024;              // Max rozmiar: 3 MB
$maxWidth      = 1600;                          // Max szerokość po przeskalowaniu
$maxHeight     = 1600;                          // Max wysokość po przeskalowaniu
$jpegQuality   = 80;                            // Jakość JPEG (0-100)
$pngQuality    = 6;                             // Kompresja PNG (0-9)
$webpQuality   = 80;                            // Jakość WEBP (0-100)
$allowedExt    = ['jpg', 'jpeg', 'png', 'webp']; // Dozwolone rozszerzenia

// ==================== WALIDACJA PLIKU ====================
// Sprawdź czy plik został przesłany
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Brak pliku lub błąd uploadu']);
    exit;
}

$file = $_FILES['image'];

// Walidacja rozmiaru
if ($file['size'] > $maxFileSize) {
    http_response_code(400);
    echo json_encode(['error' => 'Plik jest za duży (max ' . ($maxFileSize / 1024 / 1024) . 'MB)']);
    exit;
}

// Sprawdzenie MIME i wymiarów – czy to na pewno obraz
$imgInfo = getimagesize($file['tmp_name']);
if ($imgInfo === false) {
    http_response_code(400);
    echo json_encode(['error' => 'Plik nie jest poprawnym obrazem']);
    exit;
}

$mime = $imgInfo['mime']; // np. image/jpeg
switch ($mime) {
    case 'image/jpeg':
        $ext = 'jpg';
        break;
    case 'image/png':
        $ext = 'png';
        break;
    case 'image/webp':
        $ext = 'webp';
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Dozwolone formaty: JPG, PNG, WEBP']);
        exit;
}

// ==================== GENEROWANIE UNIKALNEJ NAZWY ====================
// Generuj unikalną nazwę pliku
$year  = date('Y');
$month = date('m');

$targetDir = $uploadDirBase . $year . '/' . $month . '/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0775, true);
}

$randomName = bin2hex(random_bytes(16)) . '.' . $ext;
$targetPath = $targetDir . $randomName;
// ==================== PRZETWARZANIE OBRAZU ====================
// Kompresja i skalowanie obrazu
list($width, $height) = $imgInfo;
$maxHeight = 1600;

$ratio = min($maxWidth / $width, $maxHeight / $height, 1); // 1 = bez powiększania

$newWidth  = (int)($width * $ratio);
$newHeight = (int)($height * $ratio);

switch ($mime) {
    case 'image/jpeg':
        $src = imagecreatefromjpeg($file['tmp_name']);
        break;
    case 'image/png':
        $src = imagecreatefrompng($file['tmp_name']);
        break;
    case 'image/webp':
        $src = imagecreatefromwebp($file['tmp_name']);
        break;
}

if (!$src) {
    http_response_code(500);
    echo json_encode(['error' => 'Nie można przetworzyć obrazu']);
    exit;
}

// Tworzymy przeskalowany obraz
$dst = imagecreatetruecolor($newWidth, $newHeight);

// Obsługa przezroczystości dla PNG/WEBP
if ($mime === 'image/png' || $mime === 'image/webp') {
    imagealphablending($dst, false);
    imagesavealpha($dst, true);
}

imagecopyresampled($dst, $src, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

// Zapis z kompresją
if ($mime === 'image/jpeg') {
    imagejpeg($dst, $targetPath, $jpegQuality);
} elseif ($mime === 'image/png') {
    imagepng($dst, $targetPath, $pngQuality);
} else { // webp
    imagewebp($dst, $targetPath, $webpQuality);
}

// ==================== ZAPIS DO BAZY DANYCH ====================
// Ścieżka relatywna dla bazy i dostępu z przeglądarki
$relativePath = 'uploads/posts/' . $year . '/' . $month . '/' . $randomName;

try {
    $originalName = $file['name']; // oryginalna nazwa z uploadu

    $stmt = $pdo->prepare("
        INSERT INTO images (name, path)
        VALUES (:name, :path)
    ");
    $stmt->execute([
        ':name' => $originalName,
        ':path' => $relativePath,
    ]);

    $imageId = $pdo->lastInsertId();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Błąd zapisu do bazy: ' . $e->getMessage()]);
    exit;
}


// ==================== ODPOWIEDŹ JSON ====================
// Sukces - zwróć dane obrazu
// echo json_encode([
//     'success'   => true,
//     'image_id'  => $imageId,
//     'image_url' => '/' . $relativePath,
//     'file_name' => $originalName,
//     'file_size' => $file['size'],
//     'dimensions' => [
//         'width' => $newWidth,
//         'height' => $newHeight
//     ]
// ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);