<?php

namespace App\Services\Bakong;

use Piseth\BakongKhqr\BakongKHQR;
use Piseth\BakongKhqr\Helpers\KHQRConstants;
use Piseth\BakongKhqr\Models\IndividualInfo;
use Piseth\BakongKhqr\Utils\StringUtils;

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
        $qr = (string) $response->data['qr'];

        // SDK quirk: for whole-dollar USD amounts (1.00, 5.00, …) the SDK floors
        // the float and emits tag "5401 1" instead of "5404 1.00". Bakong wallets
        // reject those as invalid. Re-encode tag 54 with 2 decimals for USD and
        // recompute the trailing CRC.
        if (strtoupper($params['currency']) === 'USD') {
            $qr = self::normalizeUsdAmount($qr, (float) $params['amount']);
        }

        return [
            'qr' => $qr,
            'md5' => md5($qr),
        ];
    }

    private static function normalizeUsdAmount(string $qr, float $amount): string
    {
        $formatted = number_format($amount, 2, '.', '');

        $body = substr($qr, 0, -8); // strip "6304XXXX" CRC tail
        $n = strlen($body);
        $i = 0;
        $start = null;
        $end = null;
        while ($i + 4 <= $n) {
            $tag = substr($body, $i, 2);
            $len = (int) substr($body, $i + 2, 2);
            $next = $i + 4 + $len;
            if ($tag === '54') {
                $start = $i;
                $end = $next;
                break;
            }
            $i = $next;
        }
        if ($start === null) {
            return $qr;
        }

        $newTag = '54' . str_pad((string) strlen($formatted), 2, '0', STR_PAD_LEFT) . $formatted;
        $base = substr($body, 0, $start) . $newTag . substr($body, $end) . '6304';

        return $base . StringUtils::crc16($base);
    }
}
