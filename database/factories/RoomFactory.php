<?php

use Faker\Generator as Faker;
use App\Room as Room;

$factory->define(Room::class, function (Faker $faker) {
    return [
        'name' => $faker->realText(50),
        'user_id' => factory(App\User::class)->create()->id,
        'private' => false
    ];
});
