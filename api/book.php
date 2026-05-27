<?php
/*
 * Mobile Master Mechanic — Booking endpoint
 *
 * SETUP (one-time):
 *  1. Fill in the CONFIG constants below.
 *  2. Download the Stripe PHP library:
 *       https://github.com/stripe/stripe-php/releases
 *     Extract into /api/stripe-php/  (so init.php lives at /api/stripe-php/init.php)
 *  3. Create /data/ directory on the server and make it writable (chmod 755).
 *  4. Add  deny from all  to /data/.htaccess so the folder is not web-accessible.
 */

/* ── CONFIG ──────────────────────────────────────────────────── */
define('STRIPE_SECRET_KEY', 'sk_test_YOUR_STRIPE_SECRET_KEY');
define('NOTIFY_EMAIL',      'gerardo@mobilemastermechanic.com'); // mechanic's email
define('FROM_EMAIL',        'noreply@mobilemastermechanic.com');
define('SITE_URL',          'https://www.mobilemastermechanic.com');
/* ─────────────────────────────────────────────────────────────── */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: ' . SITE_URL);
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

/* ── Parse body ───────────────────────────────────────────────── */
$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid JSON body']);
    exit;
}

/* ── Validate required fields ─────────────────────────────────── */
$required = ['name', 'email', 'phone', 'location', 'year', 'make', 'model', 'services', 'date', 'time'];
$missing  = [];
foreach ($required as $field) {
    $val = isset($data[$field]) ? $data[$field] : null;
    if ($val === null || $val === '' || (is_array($val) && count($val) === 0)) {
        $missing[] = $field;
    }
}
if ($missing) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Missing required fields', 'fields' => $missing]);
    exit;
}

/* ── Sanitise ─────────────────────────────────────────────────── */
function clean($v) { return htmlspecialchars(strip_tags(trim((string)$v)), ENT_QUOTES, 'UTF-8'); }

$name     = clean($data['name']);
$email    = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone    = clean($data['phone']);
$location = clean($data['location']);
$year     = clean($data['year']);
$make     = clean($data['make']);
$model    = clean($data['model']);
$variant  = clean($data['variant'] ?? '');
$dateStr  = clean($data['date']);
$time     = clean($data['time']);
$address  = clean($data['address'] ?? $location);
$notes    = clean($data['notes'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address']);
    exit;
}

$services = is_array($data['services']) ? $data['services'] : [$data['services']];
$services = array_map('clean', $services);
$servicesList = implode(', ', $services);

/* ── Generate booking ID ──────────────────────────────────────── */
$bookingId = 'MMM-' . strtoupper(substr(md5(uniqid($email, true)), 0, 8));
$vehicle   = trim("$year $make $model" . ($variant ? " ($variant)" : ''));

/* ── Load Stripe ──────────────────────────────────────────────── */
$stripePath = __DIR__ . '/stripe-php/init.php';
if (!file_exists($stripePath)) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Payment library not installed. See setup instructions in book.php.']);
    exit;
}
require_once $stripePath;

/* ── Create Stripe Checkout session ───────────────────────────── */
try {
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items'           => [[
            'price_data' => [
                'currency'     => 'usd',
                'product_data' => [
                    'name'        => 'Mobile Master Mechanic — Booking Deposit',
                    'description' => 'Booking ' . $bookingId . ' | ' . $servicesList,
                ],
                'unit_amount'  => 5000, // $50.00
            ],
            'quantity' => 1,
        ]],
        'mode'           => 'payment',
        'customer_email' => $email,
        'success_url'    => SITE_URL . '/success.html?booking=' . urlencode($bookingId),
        'cancel_url'     => SITE_URL . '/?cancelled=1',
        'metadata'       => [
            'booking_id' => $bookingId,
            'customer'   => $name,
            'phone'      => $phone,
            'email'      => $email,
            'vehicle'    => $vehicle,
            'services'   => $servicesList,
            'date'       => $dateStr,
            'time'       => $time,
            'location'   => $address,
            'notes'      => $notes,
        ],
    ]);
} catch (\Stripe\Exception\ApiErrorException $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Payment setup failed: ' . $e->getMessage()]);
    exit;
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    exit;
}

/* ── Persist booking record ───────────────────────────────────── */
$dataDir = __DIR__ . '/../data';
if (is_dir($dataDir) && is_writable($dataDir)) {
    $bookingsFile = $dataDir . '/bookings.json';
    $bookings = [];
    if (file_exists($bookingsFile)) {
        $bookings = json_decode(file_get_contents($bookingsFile), true) ?: [];
    }
    $bookings[] = [
        'id'                => $bookingId,
        'created_at'        => date('Y-m-d H:i:s T'),
        'status'            => 'pending_payment',
        'stripe_session_id' => $session->id,
        'customer'          => $name,
        'email'             => $email,
        'phone'             => $phone,
        'vehicle'           => $vehicle,
        'services'          => $services,
        'date'              => $dateStr,
        'time'              => $time,
        'location'          => $address,
        'notes'             => $notes,
    ];
    file_put_contents($bookingsFile, json_encode($bookings, JSON_PRETTY_PRINT));
}

/* ── Notify mechanic immediately ──────────────────────────────── */
$adminSubject = '[MMM] New Booking Request — ' . $bookingId;
$adminBody    = "New booking request (payment pending).\n\n"
    . "Booking ID : $bookingId\n"
    . "Customer   : $name\n"
    . "Phone      : $phone\n"
    . "Email      : $email\n"
    . "Vehicle    : $vehicle\n"
    . "Services   : $servicesList\n"
    . "Date       : $dateStr\n"
    . "Time       : $time (Central)\n"
    . "Location   : $address\n"
    . "Notes      : " . ($notes ?: 'None') . "\n\n"
    . "Stripe Session: " . $session->id . "\n"
    . "Payment URL: " . $session->url;

mail(NOTIFY_EMAIL, $adminSubject, $adminBody, 'From: ' . FROM_EMAIL . "\r\nReply-To: $email");

/* ── Respond ─────────────────────────────────────────────────── */
echo json_encode([
    'ok'               => true,
    'bookingId'        => $bookingId,
    'stripeSessionUrl' => $session->url,
]);
