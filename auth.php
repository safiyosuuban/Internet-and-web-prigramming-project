<?php
// ============================================
// Admin Authentication Handler
// POST /php/auth.php?action=login
// POST /php/auth.php?action=logout
// GET  /php/auth.php?action=check
// ============================================

require_once 'config.php';
session_start();

$action = $_GET['action'] ?? 'check';

switch ($action) {

    // ── LOGIN ────────────────────────────────
    case 'login':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['error' => 'POST required'], 405);
        }

        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $username = trim($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (empty($username) || empty($password)) {
            jsonResponse(['success' => false, 'error' => 'Username and password are required.'], 400);
        }

        // Brute-force protection
        if (!isset($_SESSION['login_attempts'])) {
            $_SESSION['login_attempts'] = 0;
            $_SESSION['login_last_attempt'] = 0;
        }
        if ($_SESSION['login_attempts'] >= 5 && (time() - $_SESSION['login_last_attempt']) < 300) {
            jsonResponse(['success' => false, 'error' => 'Too many attempts. Try again in 5 minutes.'], 429);
        }

        $pdo = getDB();
        $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Regenerate session ID on login (prevents session fixation)
            session_regenerate_id(true);
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id']        = $user['id'];
            $_SESSION['admin_username']  = $user['username'];
            $_SESSION['login_attempts']  = 0;

            // Set remember-me cookie (7 days)
            if (!empty($data['remember'])) {
                $token = bin2hex(random_bytes(32));
                setcookie('admin_remember', $token, time() + (7 * 24 * 3600), '/', '', false, true);
            }

            jsonResponse(['success' => true, 'username' => $user['username']]);
        } else {
            $_SESSION['login_attempts']++;
            $_SESSION['login_last_attempt'] = time();
            jsonResponse(['success' => false, 'error' => 'Invalid credentials.'], 401);
        }
        break;

    // ── LOGOUT ───────────────────────────────
    case 'logout':
        $_SESSION = [];
        session_destroy();
        if (isset($_COOKIE['admin_remember'])) {
            setcookie('admin_remember', '', time() - 3600, '/');
        }
        jsonResponse(['success' => true, 'message' => 'Logged out.']);
        break;

    // ── CHECK SESSION ────────────────────────
    case 'check':
        if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
            jsonResponse([
                'logged_in' => true,
                'username'  => $_SESSION['admin_username'] ?? 'Admin'
            ]);
        } else {
            jsonResponse(['logged_in' => false]);
        }
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}
