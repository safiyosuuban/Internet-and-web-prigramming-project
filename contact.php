<?php
// ============================================
// Contact Form Handler
// POST /php/contact.php
// ============================================

require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$data = json_decode(file_get_contents('php://input'), true);
if (!$data) $data = $_POST;

// ── Server-Side Validation ───────────────────
$errors = [];

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$subject = trim($data['subject'] ?? '');
$message = trim($data['message'] ?? '');

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters.';
}
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required.';
}
if (empty($subject) || strlen($subject) < 3) {
    $errors[] = 'Subject must be at least 3 characters.';
}
if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters.';
}

if (!empty($errors)) {
    jsonResponse(['success' => false, 'errors' => $errors], 400);
}

// ── Rate Limiting (Session-Based) ───────────
session_start();
$now = time();
if (!isset($_SESSION['last_contact'])) {
    $_SESSION['last_contact'] = 0;
}
if (($now - $_SESSION['last_contact']) < 60) {
    jsonResponse(['success' => false, 'errors' => ['Please wait a minute before sending another message.']], 429);
}

// ── Save to Database ─────────────────────────
try {
    $pdo = getDB();
    $stmt = $pdo->prepare("
        INSERT INTO messages (name, email, subject, message)
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        htmlspecialchars($name),
        $email,
        htmlspecialchars($subject),
        htmlspecialchars($message)
    ]);

    $_SESSION['last_contact'] = $now;
    jsonResponse([
        'success' => true,
        'message' => 'Thank you! Your message has been received.'
    ]);

} catch (Exception $e) {
    jsonResponse(['success' => false, 'errors' => ['Server error. Please try again later.']], 500);
}
