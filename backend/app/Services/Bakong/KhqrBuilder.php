<?php

namespace App\Services\Bakong;

use Piseth\BakongKhqr\BakongKHQR;
use Piseth\BakongKhqr\Helpers\KHQRConstants;
use Piseth\BakongKhqr\Models\IndividualInfo;

/**
 * Thin wrapper around the official `pisethchhun/bakong-khqr-php` SDK so the rest of
 * the app can ask for `KhqrBuilder::build([...])` without knowing about the SDK shape.
 *
 * The SDK already implements the EMVCo TLV format, CRC16/CCITT-FALSE, and the Bakong
 * tag-99 timestamp that wallet apps use to recognise a KHQR.
 */
class KhqrBuilder
{
    /**
     * @param  array{
     *   bakongAccountId: string,
     *   merchantName: string,
     *   merchantCity: string,
     *   amount: float|int,
     *   currency: string,                // 'USD' or 'KHR'
     *   merchantCategoryCode?: string,   // unused by SDK; kept for API compatibility
     *   instructionRef?: ?string,        // mapped to billNumber
     *   storeLabel?: ?string,
     *   terminalLabel?: ?string,
     * }  $params
     * @return array{qr: string, md5: string}
     */
    public static function build(array $params): array
    {
        $currency = strtoupper($params['currency']) === 'KHR'
            ? (int) KHQRConstants::$CURRENCY['KHR']
            : (int) KHQRConstants::$CURRENCY['USD'];

        $info = new IndividualInfo(
            bakongAccountID: $params['bakongAccountId'],
            merchantName: $params['merchantName'],
            merchantCity: $params['merchantCity'],
            acquiringBank: null,
            accountInformation: null,
            currency: $currency,
            amount: (float) $params['amount'],
            billNumber: $params['instructionRef'] ?? null,
            storeLabel: $params['storeLabel'] ?? null,
            terminalLabel: $params['terminalLabel'] ?? null,
        );

        $response = BakongKHQR::generateIndividual($info);
        $data = $response->data;

        return [
            'qr' => (string) $data['qr'],
            'md5' => (string) $data['md5'],
        ];
    }
}
