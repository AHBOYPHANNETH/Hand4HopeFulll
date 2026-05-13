<?php

namespace App\Console\Commands;

use App\Services\Bakong\BakongClient;
use App\Services\Bakong\KhqrBuilder;
use Illuminate\Console\Command;

class BakongCheckCommand extends Command
{
    protected $signature = 'bakong:check {account? : Bakong account ID, e.g. user@bank}';

    protected $description = 'Verify a Bakong account exists and print a sample KHQR for $1.00 USD.';

    public function handle(): int
    {
        $account = (string) ($this->argument('account') ?: config('bakong.merchant_id'));

        if ($account === '') {
            $this->error('No account given. Pass one as argument or set BAKONG_MERCHANT_ID in .env.');
            return self::FAILURE;
        }

        $this->line("Account:        {$account}");
        $this->line('Base URL:       ' . config('bakong.base_url'));
        $this->line('Token set:      ' . (config('bakong.token') ? 'yes' : 'NO — set BAKONG_API_TOKEN'));
        $this->newLine();

        $client = BakongClient::fromConfig();
        $resp = $client->checkBakongAccount($account);

        if ($resp === null) {
            $this->error('Bakong API call failed (network or token issue). Check storage/logs/laravel.log.');
            return self::FAILURE;
        }

        $code = $resp['responseCode'] ?? null;
        $msg = $resp['responseMessage'] ?? '(no message)';
        $err = $resp['errorCode'] ?? null;

        $this->line("Bakong says:    {$msg}");
        $this->line("responseCode:   {$code} (0 = exists, 1 = not found)");
        $this->line('errorCode:      ' . ($err ?? 'null'));
        $this->newLine();

        if ((int) $code !== 0) {
            $this->warn("Account '{$account}' is NOT registered on Bakong.");
            $this->line('Open the Bakong app → Profile → KHQR Account ID, and use that exact value.');
            return self::FAILURE;
        }

        $this->info("Account exists on Bakong ✓");

        $qr = KhqrBuilder::build([
            'bakongAccountId' => $account,
            'merchantName' => (string) config('bakong.merchant_name'),
            'merchantCity' => (string) config('bakong.merchant_city'),
            'merchantCategoryCode' => (string) config('bakong.merchant_category_code'),
            'amount' => 1.00,
            'currency' => 'USD',
            'instructionRef' => 'TEST0001',
            'storeLabel' => (string) config('bakong.store_label'),
            'terminalLabel' => (string) config('bakong.terminal_label'),
        ]);

        $this->newLine();
        $this->line('Sample QR ($1.00 USD):');
        $this->line($qr['qr']);
        $this->line('MD5: ' . $qr['md5']);

        $imageUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=8&data=' . rawurlencode($qr['qr']);
        $this->newLine();
        $this->line('Scan this URL to see the QR image (Ctrl+click in most terminals):');
        $this->line($imageUrl);

        $this->parseAndPrintTlv($qr['qr']);

        return self::SUCCESS;
    }

    private function parseAndPrintTlv(string $qr): void
    {
        $this->newLine();
        $this->line('Decoded TLV:');
        $i = 0;
        $n = strlen($qr);
        while ($i + 4 <= $n) {
            $tag = substr($qr, $i, 2);
            $len = (int) substr($qr, $i + 2, 2);
            $value = substr($qr, $i + 4, $len);
            $this->line(sprintf('  %s (%02d) %s', $tag, $len, $value));
            $i += 4 + $len;
        }
    }
}
