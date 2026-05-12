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
        $account = (string) ($this->argument('account') ?: config('bakong.account_id'));

        if ($account === '') {
            $this->error('No account given. Pass one as argument or set BAKONG_ACCOUNT_ID in .env.');
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

        return self::SUCCESS;
    }
}
