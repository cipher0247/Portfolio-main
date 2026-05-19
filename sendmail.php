<?php
header('Content-Type: application/json; charset=utf-8');

require_once 'config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

function is_email_valid($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate inputs
if ($name === '' || $email === '' || $subject === '' || $message === '' || !is_email_valid($email)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields with valid values.']);
    exit;
}

// Avoid Email Injection and Mail Form Script Hijacking
$pattern = '/(content-type|bcc:|cc:|to:|subject:|from:)/i';
if (preg_match($pattern, $name) || preg_match($pattern, $subject) || preg_match($pattern, $message)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input detected.']);
    exit;
}

$to = CONTACT_EMAIL;
$subjectHeader = 'Portfolio Contact: ' . substr($subject, 0, 50);
$body = '<strong>Name:</strong> ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '<br>';
$body .= '<strong>Email:</strong> ' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '<br>';
$body .= '<strong>Subject:</strong> ' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '<br><br>';
$body .= '<strong>Message:</strong><br>' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '<br>';

// Email headers
$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-Type: text/html; charset=UTF-8' . "\r\n";
$headers .= 'From: no-reply@' . $_SERVER['SERVER_NAME'] . "\r\n";
$headers .= 'Reply-To: ' . $email . "\r\n";

// Send email
$mailSent = @mail($to, $subjectHeader, $body, $headers);

if (DEBUG_MODE) {
    $debug = [
        'to' => $to,
        'subject' => $subjectHeader,
        'function_exists_mail' => function_exists('mail'),
        'sendmail_from' => ini_get('sendmail_from'),
        'mail_result' => $mailSent ? 'true' : 'false',
        'timestamp' => date('Y-m-d H:i:s')
    ];
    file_put_contents(LOG_FILE, json_encode($debug) . "\n", FILE_APPEND);
}

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully! I will get back to you soon.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again or email directly to ' . CONTACT_EMAIL]);
}
exit;
?>