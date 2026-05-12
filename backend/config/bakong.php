<?php

return [
    'base_url' => env('BAKONG_API_BASE_URL', 'https://api-bakong.nbc.gov.kh'),
    'token' => env('BAKONG_API_TOKEN', ''),
    'timeout' => (int) env('BAKONG_API_TIMEOUT', 15),

    // KHQR merchant identity — embedded in every QR.
    'account_id' => env('BAKONG_ACCOUNT_ID', ''),
    'merchant_name' => env('BAKONG_MERCHANT_NAME', 'Hand4Hope'),
    'merchant_city' => env('BAKONG_MERCHANT_CITY', 'Phnom Penh'),
    'merchant_category_code' => env('BAKONG_MCC', '5999'),
    'store_label' => env('BAKONG_STORE_LABEL', 'Hand4Hope'),
    'terminal_label' => env('BAKONG_TERMINAL_LABEL', 'WEB'),
];
