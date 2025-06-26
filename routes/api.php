<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GeneralTaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

  Route::post('/CreateUser', [AuthController::class, 'user_Register']);
  Route::get('/ReSendEmail/{email}', [AuthController::class, 'resend_email']);
  Route::post('/Verification/{email}', [AuthController::class, 'verification']);
  Route::post('/ReSetPassword/{email}', [AuthController::class, 'reset_password']);

  Route::post('/CreateOwner/{email}', [AuthController::class, 'create_owner']);
  Route::post('/Login', [AuthController::class, 'login']);

  Route::get('/GetAllOwnerCategories', [GeneralTaskController::class, 'get_all_owners_categories']);
  Route::get('/GetAllCountries', [GeneralTaskController::class, 'get_all_countries']);
  Route::get('/GetAllAccommodationTypes', [GeneralTaskController::class, 'get_all_accommodation_types']);
  Route::get('/GetAllCarTypes', [GeneralTaskController::class, 'get_all_car_types']);
  Route::get('/GetAllPlaneTypes', [GeneralTaskController::class, 'get_all_plane_types']);
  Route::get('/GetAllServices', [GeneralTaskController::class, 'get_all_services']);

  Route::middleware('auth:sanctum')->group(function () {

  Route::get('/Logout', [AuthController::class, 'logout']);
  Route::get('/ShowProfile', [GeneralTaskController::class, 'show_profile']);

  // Admin
    // Request
  Route::get('/GetAllRequests', [AdminController::class, 'get_all_requests']);
  Route::get('/ShowRequest/{id}', [AdminController::class, 'show_request']);
  Route::post('/EditRequest/{id}', [AdminController::class, 'edit_request']);
  Route::get('/AcceptRequest/{id}', [AdminController::class, 'accept_request']);
  Route::get('/DeleteRequest/{id}', [AdminController::class, 'delete_request']);
  
    // Owner
  Route::get('/GetAllOwners', [AdminController::class, 'get_all_owners']);
  Route::get('/ShowOwner/{id}', [AdminController::class, 'show_owner']);
  Route::get('/BlockOwner/{id}', [AdminController::class, 'block']);
  Route::post('/AdminSearch', [AdminController::class, 'admin_search']);
  Route::get('/ShowRoom/{id}', [AdminController::class, 'show_room']);

});
