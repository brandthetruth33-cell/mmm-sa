<?php
/*
 * Mobile Master Mechanic — Stripe webhook handler
 *
 * SETUP:
 *  1. Fill in the CONFIG constants below.
 *  2. In Stripe Dashboard → Developers → Webhooks:
 *       Endpoint URL : https://www.mobilemastermechanic.com/api/webhook.php
 *       Events       : checkout.session.completed
 *     Copy the "Signing secret" (whsec_...) into STRIPE_WEBHOOK_SECRET below.
 */

/* ── CONFIG ──────────────────────────────────────────────────── */
define('STRIPE_SECRET_KEY',     'sk_test_YOUR_STRIPE_SECRET_KEY');
define('STRIPE_WEBHOOK_SECRET', 'whsec_YOUR_WEBHOOK_SIGNING_SECRET');
define('NOTIFY_EMAIL',          'gerardo@mobilemastermechanic.com');
define('FROM_EMAIL',            'noreply@mobilemastermechanic.com');
/* ─────────────────────────────────────────────────────────────── */

require_once __DIR__ . '/stripe-php/init.php';

\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

$payload = file_get_contents('php://input');
$sigHeader = isset($_SERVER['HTTP_STRIPE_SIGNATURE']) ? $_SERVER['HTTP_STRIPE_SIGNATURE'] : '';

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, STRIPE_WEBHOOK_SECRET);
} catch (\UnexpectedValueException $e) {
    http_response_code(400);
    exit('Invalid payload');
} catch (\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit('Invalid signature');
}

if ($event->type === 'checkout.session.completed') {
    $session  = $event->data->object;
    $meta     = $session->metadata;
    $customer = $session->customer_details;

    $bookingId   = $meta->booking_id   ?? 'Unknown';
    $name        = $meta->customer     ?? ($customer->name ?? 'Customer');
    $email       = $customer->email    ?? ($meta->email ?? '');
    $vehicle     = $meta->vehicle      ?? '';
    $services    = $meta->services     ?? '';
    $dateStr     = $meta->date         ?? '';
    $time        = $meta->time         ?? '';
    $location    = $meta->location     ?? '';
    $notes       = $meta->notes        ?? '';

    /* -- Update booking status in records file -- */
    $dataDir      = __DIR__ . '/../data';
    $bookingsFile = $dataDir . '/bookings.json';
    if (file_exists($bookingsFile)) {
        $bookings = json_decode(file_get_contents($bookingsFile), true) ?: [];
        foreach ($bookings as &$b) {
            if ($b['id'] === $bookingId) {
                $b['status'] = 'confirmed';
                $b['paid_at'] = date('Y-m-d H:i:s T');
                break;
            }
        }
        unset($b);
        file_put_contents($bookingsFile, json_encode($bookings, JSON_PRETTY_PRINT));
    }

    /* -- Confirmation email to customer -- */
    $custSubject = 'Booking confirmed — Mobile Master Mechanic (' . $bookingId . ')';
    $custBody    = "Hi $name,\n\n"
        . "Your booking is confirmed and your \$50 deposit has been received. We'll see you soon!\n\n"
        . "--- YOUR BOOKING DETAILS ---\n"
        . "Booking ID  : $bookingId\n"
        . "Vehicle     : $vehicle\n"
        . "Services    : $services\n"
        . "Date        : $dateStr\n"
        . "Time        : $time (Central Time)\n"
        . "Location    : $location\n"
        . ($notes ? "Notes       : $notes\n" : '')
        . "\nDeposit paid: \$50.00\n"
        . "Balance due on-site at time of service.\n"
        . "We accept cash, card, and Zelle.\n\n"
        . "Questions? Call or text us at (210)-318-5426.\n\n"
        . "— Mobile Master Mechanic\n"
        . "  mobilemastermechanic.com";

    if ($email) {
        mail($email, $custSubject, $custBody, "From: " . FROM_EMAIL . "\r\nReply-To: " . NOTIFY_EMAIL);
    }

    /* -- Notify mechanic: payment confirmed -- */
    $adminSubject = '[MMM] PAID & CONFIRMED — ' . $bookingId;
    $adminBody    = "Deposit payment received. Booking is confirmed.\n\n"
        . "Booking ID : $bookingId\n"
        . "Customer   : $name\n"
        . "Email      : $email\n"
        . "Phone      : " . ($meta->phone ?? '') . "\n"
        . "Vehicle    : $vehicle\n"
        . "Services   : $services\n"
        . "Date       : $dateStr\n"
        . "Time       : $time (Central)\n"
        . "Location   : $location\n"
        . "Notes      : " . ($notes ?: 'None') . "\n\n"
        . "Deposit: \$50.00 collected via Stripe.\n"
        . "Stripe session: " . $session->id;

    mail(NOTIFY_EMAIL, $adminSubject, $adminBody, 'From: ' . FROM_EMAIL);
}

http_response_code(200);
echo json_encode(['received' => true]);
