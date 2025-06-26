<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AirLineController;
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

  Route::get('/getallpackage',[AdminController::class,'getAllPackages']);
  Route::get('/getPackage/{id}',[AdminController::class,'getPackage']);
  Route::get('/getalluser',[AdminController::class,'getAllUsers']);
  Route::get('/createSubAdmin/{id}',[AdminController::class,'createSubAdmin']);
  Route::get('/getAllSubAdmin',[AdminController::class,'getAllSubAdmin']);
  Route::get('/removeSubAdmin/{id}',[AdminController::class,'removeSubAdmin']);
  Route::get('/getAllActivity',[AdminController::class,'getAllActivity']);
  Route::post('/addActivity',[AdminController::class,'addActivity']);
  Route::delete('/deleteactivity/{id}',[AdminController::class,'deleteactivity']);
  Route::get('/paybypoint/{id}',[AdminController::class,'paybypoint']);
  Route::post('/addcatigory',[AdminController::class,'addcatigory']);
  
    // Owner
  Route::get('/GetAllOwners', [AdminController::class, 'get_all_owners']);
  Route::get('/ShowOwner/{id}', [AdminController::class, 'show_owner']);
  Route::get('/BlockOwner/{id}', [AdminController::class, 'block']);
  Route::post('/AdminSearch', [AdminController::class, 'admin_search']);
  Route::get('/ShowRoom/{id}', [AdminController::class, 'show_room']);

  // AirLine
  Route::post('/AddPlane', [AirLineController::class, 'add_plane']);
  Route::post('/EditPlane/{plane_id}', [AirLineController::class, 'edit_plane']);
  Route::get('/GetAllPlanes', [AirLineController::class, 'get_all_planes']);
  Route::get('/GetSinglePlane/{plane_id}', [AirLineController::class, 'get_single_plane']);
  Route::get('/DeletePlane/{plane_id}', [AirLineController::class, 'delete_plane']);

  Route::post('/AddFlight', [AirLineController::class, 'add_flight']);
  Route::get('/GetFlightDetails/{flight_id}', [AirLineController::class, 'get_flight_details']);

});
