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
        $locale = config('app.locale'); // if no preferred language is found at all, use the default
        $supportedLocales = array_fill_keys(config('app.supported_locales'), 1); // optimisation, avoids looping through supported locales array by using a key-value pair
        
        if($request->has('lang'))
        {
            $locale = $request->get('lang');      
            if(!isset($supportedLocales[$locale]))
                $locale = config('app.fallback_locale'); // if requested language is not supported, use the fallback locale
        }
        else
        {
            $userLangs = preg_split('/,|;/', $request->server('HTTP_ACCEPT_LANGUAGE')); // accept-language header varies from browser to browser
            foreach($userLangs as $lang)
            {
                /**
                 * Find the first user-preferred language that our app supports
                 */
                if(isset($supportedLocales[$lang]))
                {
                    $locale = $lang;
                    break;
                }        
            }
        }

        app()->setLocale($locale);
        return $next($request);
    }
}