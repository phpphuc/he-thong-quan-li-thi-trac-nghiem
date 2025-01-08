<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\PersonalAccessToken;
use Laravel\Sanctum\Sanctum;
use Carbon\Carbon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // DB::listen(function ($query) {
        //     Log::info($query->sql);
        // });
        DB::listen(function ($query) {
            logger($query->sql, $query->bindings, $query->time);
        });
        //
        Sanctum::usePersonalAccessTokenModel(PersonalAccessToken::class);

        // Carbon::setLocale(config('app.locale'));
        // date_default_timezone_set(config('app.timezone'));
        Carbon::setLocale(config('app.locale'));
        date_default_timezone_set('Asia/Ho_Chi_Minh');
    }
}
