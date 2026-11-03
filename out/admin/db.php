<?php
// Database connection (MySQL, PDO)
// Use the SAME user and password that work on the live server.
// Never share this file publicly.

$host    = 'localhost';
$db      = 'machinemanuganda_machineman_db';
$user    = 'machinemanuganda_panel';
$pass    = 'xaviselecao123567891';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // Log the real error privately; show visitors a generic message only
    error_log('DB connection failed: ' . $e->getMessage());
    http_response_code(500);
    exit('Database connection failed.');
}


//

