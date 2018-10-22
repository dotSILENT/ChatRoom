<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Closure;

class DetectLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $locale = '';
        
        if($request->has('lang'))
            $locale = $request->get('lang');
        else
            $locale = $request->getPreferredLanguage();          
            
        if(!in_array($locale, config('app.supported_locales')))
            $locale = config('app.fallback_locale');

        app()->setLocale($locale);

        return $next($request);
    }
}