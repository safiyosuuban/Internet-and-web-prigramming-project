<?php
// ============================================
// Messages API (Admin Dashboard)
// GET  /php/messages.php         - All messages
// POST /php/messages.php?action=mark_read&id=1
// POST /php/messages.php?action=delete&id=1
// ============================================

require_once 'config.php';
session_start();

if (!isset($_SESSION['admin_logged_in'])) {
    jsonResponse(['error' => 'Unauthorized. Please log in.'], 401);
}

$pdo    = getDB();
$action = $_GET['action'] ?? 'list';

switch ($action) {
    case 'list':
        $stmt = $pdo->query("SELECT * FROM messages ORDER BY created_at DESC");
        jsonResponse($stmt->fetchAll());
        break;

    case 'mark_read':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $pdo->prepare("UPDATE messages SET is_read = 1 WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    case 'delete':
        $id = intval($_GET['id'] ?? 0);
        if (!$id) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
        $stmt->execute([$id]);
        jsonResponse(['success' => true]);
        break;

    case 'stats':
        $total  = $pdo->query("SELECT COUNT(*) FROM messages")->fetchColumn();
        $unread = $pdo->query("SELECT COUNT(*) FROM messages WHERE is_read = 0")->fetchColumn();
        $projects = $pdo->query("SELECT COUNT(*) FROM projects")->fetchColumn();
        jsonResponse(['total_messages' => $total, 'unread' => $unread, 'total_projects' => $projects]);
        break;

    default:
        jsonResponse(['error' => 'Unknown action'], 400);
}
