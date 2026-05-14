<?php
// ============================================
// Projects API Endpoint
// GET  /php/projects.php         - List all projects
// GET  /php/projects.php?id=1    - Single project
// POST /php/projects.php         - Create project (admin)
// POST /php/projects.php?_method=PUT&id=1  - Update (admin)
// POST /php/projects.php?_method=DELETE&id=1 - Delete (admin)
// ============================================

require_once 'config.php';
session_start();

$method = $_SERVER['REQUEST_METHOD'];
$override = $_GET['_method'] ?? null;
if ($method === 'POST' && $override) $method = strtoupper($override);

$pdo = getDB();

switch ($method) {
    // ── GET: Fetch Projects ──────────────────
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $project = $stmt->fetch();
            if ($project) {
                jsonResponse($project);
            } else {
                jsonResponse(['error' => 'Project not found'], 404);
            }
        } else {
            $category = $_GET['category'] ?? null;
            if ($category && $category !== 'all') {
                $stmt = $pdo->prepare("SELECT * FROM projects WHERE category = ? ORDER BY featured DESC, created_at DESC");
                $stmt->execute([$category]);
            } else {
                $stmt = $pdo->query("SELECT * FROM projects ORDER BY featured DESC, created_at DESC");
            }
            jsonResponse($stmt->fetchAll());
        }
        break;

    // ── POST: Create Project (Admin Only) ───
    case 'POST':
        if (!isset($_SESSION['admin_logged_in'])) {
            jsonResponse(['error' => 'Unauthorized'], 401);
        }
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $required = ['title', 'description', 'tech_stack'];
        foreach ($required as $field) {
            if (empty($data[$field])) {
                jsonResponse(['error' => "Field '$field' is required"], 400);
            }
        }
        $stmt = $pdo->prepare("
            INSERT INTO projects (title, description, tech_stack, github_url, live_url, image_url, category, featured)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            htmlspecialchars($data['title']),
            htmlspecialchars($data['description']),
            htmlspecialchars($data['tech_stack']),
            $data['github_url'] ?? null,
            $data['live_url'] ?? null,
            $data['image_url'] ?? null,
            $data['category'] ?? 'web',
            $data['featured'] ?? 0
        ]);
        jsonResponse(['success' => true, 'id' => $pdo->lastInsertId()], 201);
        break;

    // ── PUT: Update Project (Admin Only) ────
    case 'PUT':
        if (!isset($_SESSION['admin_logged_in'])) {
            jsonResponse(['error' => 'Unauthorized'], 401);
        }
        if (!isset($_GET['id'])) jsonResponse(['error' => 'ID required'], 400);
        $data = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $stmt = $pdo->prepare("
            UPDATE projects SET
                title = ?, description = ?, tech_stack = ?,
                github_url = ?, live_url = ?, image_url = ?,
                category = ?, featured = ?
            WHERE id = ?
        ");
        $stmt->execute([
            htmlspecialchars($data['title']),
            htmlspecialchars($data['description']),
            htmlspecialchars($data['tech_stack']),
            $data['github_url'] ?? null,
            $data['live_url'] ?? null,
            $data['image_url'] ?? null,
            $data['category'] ?? 'web',
            $data['featured'] ?? 0,
            $_GET['id']
        ]);
        jsonResponse(['success' => true]);
        break;

    // ── DELETE: Remove Project (Admin Only) ─
    case 'DELETE':
        if (!isset($_SESSION['admin_logged_in'])) {
            jsonResponse(['error' => 'Unauthorized'], 401);
        }
        if (!isset($_GET['id'])) jsonResponse(['error' => 'ID required'], 400);
        $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        jsonResponse(['success' => true]);
        break;

    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}
