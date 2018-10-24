<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use \App\Room;

class RoomsControllerTest extends TestCase
{
    public function test_user_can_access_public_room()
    {
        $room = factory(Room::class)->create();
        $user = factory(\App\User::class)->create();

        $response = $this->actingAs($user)->get(route('rooms.show', $room->id));

        $response->assertStatus(200);
    }

    public function test_user_cannot_access_private_room()
    {
        $room = factory(Room::class)->create(['private' => true]);
        $user = factory(\App\User::class)->create();

        $response = $this->actingAs($user)->get(route('rooms.show', $room->id));

        $response->assertStatus(401);
    }

    public function test_user_can_access_his_private_room()
    {
        $room = factory(Room::class)->create(['private' => true]);

        $response = $this->actingAs($room->owner)->get(route('rooms.show', $room->id));

        $response->assertStatus(200);
    }

    public function test_user_can_create_room()
    {
        $user = factory(\App\User::class)->create();

        $response = $this->actingAs($user)->call('POST', route('rooms.store'), ['roomName' => 'New test room']);

        $room = Room::where('name', 'New test room')->get();

        $this->assertEquals($room->count(), 1);
        $response->assertRedirect(route('rooms.show', $room->first()->id));
    }

    public function test_guest_cannot_view_room_creation_form()
    {
        $response = $this->get(route('rooms.create'));
        
        $response->assertRedirect(route('login'));
    }

    public function test_guest_cannot_create_room()
    {
        $response = $this->call('POST', route('rooms.store'), ['roomName' => 'Test']);

        $response->assertRedirect(route('login'));
    }
}
