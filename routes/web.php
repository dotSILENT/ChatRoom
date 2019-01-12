<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// main page
Route::get('/', 'PagesController@index')->name('home');

Route::resource('rooms', 'RoomsController');

// User profiles
Route::group(['prefix' => 'users', 'as' => 'users.'], function()
{
    Route::get('{id}', 'UsersController@show')->name('show');
    Route::get('{id}/edit', 'UsersController@edit')->name('edit');
    Route::put('{id}/update', 'UsersController@update')->name('update');
});

Auth::routes();
Route::get('/logout', '\App\Http\Controllers\Auth\LoginController@logout')->name('logout'); // laravel forces you to use POST to succesfully logout, we don't neccessarily need that
