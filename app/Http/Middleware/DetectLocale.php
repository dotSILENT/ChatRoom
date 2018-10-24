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
        
        if($request->has('lang'))
        {
            $locale = $request->get('lang');      
            if(!in_array($locale, config('app.supported_locales')))
                $locale = config('app.fallback_locale'); // if requested language is not supported, use the fallback locale
        }
        else
        {
            //$locale = $request->getPreferredLanguage();
            $userLangs = preg_split('/,|;/', $request->server('HTTP_ACCEPT_LANGUAGE')); // accept-language header varies from browser to browser
            $counter = 0;
            foreach($userLangs as $lang)
            {
                if(++$counter >= 100) // forged Accept-Language header? Prevent unneccessary looping
                    break;
                /**
                 * Find the first user-preferred language that our app supports
                 * Ignore values starting with q= to prevent unneccessary looping
                 */
                if(substr($lang,2) != 'q=' && in_array($lang, config('app.supported_locales')))
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