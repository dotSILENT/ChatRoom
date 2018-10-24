<?php
    /**
     * Simple APIToken trait which handles Eloquent model events to generate tokens used by Laravel's auth:api
     * 
     * @author dotSILENT <dot.silentium@gmail.com>
     */

     namespace App\Traits;

     trait APIToken
     {
         /**
          * Register the events.
          *
          * @return void
          */
         public static function bootAPIToken()
         {
            static::creating(function ($model)
            {
                $model->api_token = self::generateToken();
            });
         }

         /**
          * Generate a random 60 char token.
          *
          * @return string
          */
          protected static function generateToken()
          {
              return bin2hex(openssl_random_pseudo_bytes(30));
          }

          /**
           * Generate a new token for this model
           *
           * @return void
           */
          public function refreshToken()
          {
              $this->api_token = self::generateToken();
              $this->save();
          }
     }
?>