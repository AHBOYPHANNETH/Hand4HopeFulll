<?php

namespace App\Services\Bakong;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Thin wrapper around the Bakong Open API.
 * Token + base URL come from config('bakong').
 */
class BakongClient
{
    public function __construct(
        private readonly string $baseUrl,
        private readonly string $token,
        private readonly int $timeout = 15,
    ) {}

    public static function fromConfig(): self
    {
        return new self(
            baseUrl: rtrim((string) config('bakong.base_url'), '/'),
            token: (string) config('bakong.token'),
            timeout: (int) config('bakong.timeout', 15),
        );
    }

    /**
     * Query a single transaction by MD5. Returns the parsed JSON or null on transport failure.
     *
     * @return array<string,mixed>|null
     */
    public function checkTransactionByMd5(string $md5): ?array
    {
        return $this->post('/v1/check_transaction_by_md5', ['md5' => $md5]);
    }

    /**
     * Verify whether a Bakong account ID exists.
     *
     * @return array<string,mixed>|null
     */
    public function checkBakongAccount(string $accountId): ?array
    {
        return $this->post('/v1/check_bakong_account', ['accountId' => $accountId]);
    }

    private function post(string $path, array $body): ?array
    {
        if ($this->baseUrl === '' || $this->token === '') {
            Log::warning('Bakong is not configured: base_url or token missing.');
            return null;
        }

        try {
            $response = Http::timeout($this->timeout)
                ->withToken($this->token)
                ->acceptJson()
                ->asJson()
                ->post($this->baseUrl . $path, $body);
        } catch (\Throwable $e) {
            Log::error('Bakong request failed', [
                'path' => $path,
                'error' => $e->getMessage(),
            ]);
            return null;
        }

        return $this->parse($response);
    }

    private function parse(Response $response): ?array
    {
        $json = $response->json();
        if (!is_array($json)) {
            Log::warning('Bakong returned non-JSON response', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return null;
        }
        return $json;
    }
}
