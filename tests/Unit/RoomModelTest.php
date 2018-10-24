<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Room;

class RoomModelTest extends TestCase
{
    use RefreshDatabase;
   
    public function test_allfiltered_returns_no_private_rooms()
    {
        factory(Room::class, 5)->create(['private' => true]);
        
        $rooms = Room::allFiltered()->get();

        $this->assertEquals($rooms->count(), 0);
    }
    
    public function test_allfiltered_returns_user_owned_private_rooms()
    {
        $user = factory(\App\User::class)->create();
        factory(Room::class, 5)->create(['private' => true, 'user_id' => $user->id]);

        $rooms = Room::allFiltered($user->id)->get();

        $this->assertEquals($rooms->count(), 5);
    }

    public function test_allfiltered_returns_only_users_private_rooms()
    {
        factory(Room::class, 5)->create(['private' => true]);
        $user = factory(\App\User::class)->create();
        factory(Room::class, 2)->create(['private' => true, 'user_id' => $user]);

        $rooms = Room::allFiltered($user->id)->get();

        $this->assertEquals($rooms->where('user_id', $user->id)->count(), 2);
    }
}
