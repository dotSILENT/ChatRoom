# ChatRoom
Work in progress, this isn't finished yet!

## Installation and usage
1. Clone this repository
2. Execute ```composer install``` to install dependencies
3. Execute ```npm install``` to install NodeJS dependencies
4. Rename ``.env.example`` to ``.env`` and configure it accordingly
5. Execute ```php artisan key:generate``` to generate the encryption key for Laravel
6. Execute ```php artisan storage:link``` to create a symlink for public storage (avatars etc.)
7. Set up a **Redis** server to be used with Laravel Echo Server
8. Execute ```laravel-echo-server init``` and configure the Laravel Echo server
    * The port for Laravel Echo client can be changed in ``resources/js/bootstrap.js`` if not using the default (6001)
9. Start the **Redis** server
10. Start the Laravel Echo Server by executing ```laravel-echo-server start``` and start the web server

Everything should be now working properly as long as the configuration is correct.
You can put a default avatar file called with the name specified as ``AVATARS_DEFAULT`` in ``.env`` into ``storage/public/avatars/``