<?php
// Receives the Contact / Quote forms and stores them for the admin.
require __DIR__ . '/../admin/db.php';
header('Content-Type: application/json; charset=utf-8');

function out(array $a, int $code = 200): void { http_response_code($code); echo json_encode($a); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') out(['ok' => false, 'error' => 'Method not allowed.'], 405);

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) out(['ok' => false, 'error' => 'Invalid request.'], 400);

// Hidden field that only robots fill in
if (!empty($in['website'])) out(['ok' => true]);

$clip = fn($v, $n) => mb_substr(trim((string)($v ?? '')), 0, $n);
$type    = ($in['type'] ?? '') === 'quote' ? 'quote' : 'contact';
$name    = $clip($in['name'] ?? '', 190);
$phone   = $clip($in['phone'] ?? '', 60);
$email   = $clip($in['email'] ?? '', 190);
$subject = $clip($in['subject'] ?? '', 255);
$qty     = $clip($in['quantity'] ?? '', 30);
$message = $clip($in['message'] ?? '', 5000);
$company = $clip($in['company'] ?? '', 190);
if ($company !== '') $message = "Company: $company\n\n" . $message;

if ($name === '' || $phone === '' || $message === '') out(['ok' => false, 'error' => 'Please fill in your name, phone and message.'], 422);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) out(['ok' => false, 'error' => 'That email address does not look right.'], 422);

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
try {
    // no more than 5 messages per visitor in 10 minutes
    $c = $pdo->prepare('SELECT COUNT(*) FROM enquiries WHERE ip = ? AND created_at > (NOW() - INTERVAL 10 MINUTE)');
    $c->execute([$ip]);
    if ((int)$c->fetchColumn() >= 5) out(['ok' => false, 'error' => 'Too many messages. Please try again in a few minutes.'], 429);

    $pdo->prepare('INSERT INTO enquiries (type,name,phone,email,subject,message,quantity,ip) VALUES (?,?,?,?,?,?,?,?)')
        ->execute([$type, $name, $phone, $email, $subject, $message, $qty, $ip]);

    // Best-effort email copy to the address in Site content
    $to = '';
    $r = $pdo->prepare("SELECT v FROM site_settings WHERE k = 'email'");
    $r->execute();
    $to = (string)$r->fetchColumn();
    if ($to === '') $to = 'mugenyihussein2001@gmail.com';
    if (filter_var($to, FILTER_VALIDATE_EMAIL)) {
        $body = "New " . ($type === 'quote' ? 'quote request' : 'enquiry') . " from the website\n\nName: $name\nPhone: $phone\nEmail: $email\n"
              . ($subject !== '' ? "Equipment: $subject\n" : '') . ($qty !== '' ? "Quantity: $qty\n" : '') . "\n$message\n";
        $headers = 'From: website@' . preg_replace('/^www\./', '', $_SERVER['HTTP_HOST'] ?? 'localhost');
        if ($email !== '') $headers .= "\r\nReply-To: $email";
        @mail($to, 'Website ' . $type . ': ' . $name, $body, $headers);
    }
    out(['ok' => true]);
} catch (Throwable $e) {
    out(['ok' => false, 'error' => 'Sorry, we could not save your message. Please call or WhatsApp us.'], 500);
}
