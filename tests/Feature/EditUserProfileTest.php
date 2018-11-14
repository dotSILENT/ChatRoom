<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class EditUserProfileTest extends TestCase
{
    private $user;
    private $password = 'password';

    public function setUp()
    {
        parent::setUp();
        $this->user = factory(\App\User::class)->create(['password' => Hash::make($this->password)]);
        $this->actingAs($this->user);
    }

    public function tearDown()
    {
        parent::tearDown();
        $this->user->delete();
    }

    public function test_user_can_access_own_profile_edition()
    {
        $response = $this->get(route('users.edit', '@me'));

        $response->assertSuccessful();
        $response->assertSee($this->user->displayName());
    }

    public function test_user_can_change_display_name()
    {
        $this->call('PUT', route('users.update', '@me'), ['displayname' => 'testname', 'currentpass' => $this->password]);

        $usr = \App\User::findOrFail($this->user->id);
        
        $this->assertEquals($usr->displayName(), 'testname');
    }

    public function test_user_can_restore_original_display_name()
    {
        $this->call('PUT', route('users.update', '@me'), ['displayname' => '', 'currentpass' => $this->password]);

        $usr = \App\User::findOrFail($this->user->id);

        $this->assertEquals($usr->displayName(), $usr->username);
    }

    public function test_user_can_change_password()
    {
        $this->call('PUT', route('users.update', '@me'), ['currentpass' => $this->password, 'newpass' => 'newpassword']);

        $usr = \App\User::findOrFail($this->user->id);

        $this->assertFalse(Hash::check($usr->password, $this->user->password));
    }

    public function test_user_can_change_email()
    {
        $this->call('PUT', route('users.update', '@me'), ['email' => 'newmail@test.ts', 'currentpass' => $this->password]);

        $usr = \App\User::findOrFail($this->user->id);

        $this->assertEquals($usr->email, 'newmail@test.ts');
    }

    public function test_user_can_delete_avatar()
    {
        $this->user->avatar = 'test.jpg';
        $this->user->update();

        $this->call('PUT', route('users.update', '@me'), ['delete_avatar' => true, 'currentpass' => $this->password]);

        $usr = \App\User::findOrFail($this->user->id);

        $this->assertEquals($usr->avatar, config('app.default_avatar'));
    }
}
