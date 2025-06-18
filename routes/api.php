<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

  Route::post('/CreateUser', [AuthController::class, 'user_Register']);
  Route::get('/ReSendEmail/{email}', [AuthController::class, 'resend_email']);
  Route::post('/Verification/{email}', [AuthController::class, 'verification']);
  Route::post('/ReSetPassword/{email}', [AuthController::class, 'reset_password']);

  Route::post('/CreateOwner/{email}', [AuthController::class, 'create_owner']);
  Route::post('/Login', [AuthController::class, 'login']);

  Route::middleware('auth:sanctum')->group(function () {

  Route::get('/Logout', [AuthController::class, 'logout']);
  

});
