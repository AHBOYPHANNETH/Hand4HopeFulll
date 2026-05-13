<?php

return [
    'base_url' => env('BAKONG_BASE_URL', 'https://api-bakong.nbc.gov.kh'),
    'token' => env('BAKONG_TOKEN', ''),
    'timeout' => (int) env('BAKONG_API_TIMEOUT', 15),

    // KHQR merchant identity — embedded in every QR.
    'merchant_id' => env('BAKONG_MERCHANT_ID', ''),
    'merchant_name' => env('BAKONG_MERCHANT_NAME', 'Hand4Hope'),
    'merchant_city' => env('BAKONG_MERCHANT_CITY', 'Phnom Penh'),
    'merchant_category_code' => env('BAKONG_MCC', '5999'),
    'store_label' => env('BAKONG_STORE_LABEL', 'Hand4Hope'),
    'terminal_label' => env('BAKONG_TERMINAL_LABEL', 'WEB'),

    // Default currency used when the request doesn't specify one.
    'currency' => env('BAKONG_CURRENCY', 'USD'),

    // Pending KHQR donations expire this many minutes after creation.
    'intent_expiry_minutes' => (int) env('INTENT_EXPIRY_MINUTES', 10),

    // Identity passed to Bakong's deeplink generator so the wallet picker
    // shows our brand and returns to our site after payment.
    'app_name' => env('BAKONG_APP_NAME', 'Hand4Hope'),
    'app_icon_url' => env('BAKONG_APP_ICON_URL', ''),
    'app_callback_url' => env('BAKONG_APP_CALLBACK_URL', env('FRONTEND_URL', '')),
];
