<?php

use App\Http\Controllers\AccommodationController;
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

    // Owner Id
    Route::get('/WhoAmI', [GeneralTaskController::class, 'who_am_i']);


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

  // AirLine
  //1. planes
  Route::post('/AddPlane', [AirLineController::class, 'add_plane']);
  Route::post('/EditPlane/{plane_id}', [AirLineController::class, 'edit_plane']);
  Route::get('/GetAllPlanes', [AirLineController::class, 'get_all_planes']);
  Route::get('/GetSinglePlane/{plane_id}', [AirLineController::class, 'get_single_plane']);
  Route::get('/DeletePlane/{plane_id}', [AirLineController::class, 'delete_plane']);

  //2. flights
  Route::post('/AddFlight', [AirLineController::class, 'add_flight']);
  Route::post('/EditFlight/{flight_id}', [AirLineController::class, 'edit_flight']);
  Route::post('/EditSeats', [AirLineController::class, 'edit_seats']);
  Route::get('/GetFlightDetails/{flight_id}', [AirLineController::class, 'get_flight_details']);
  Route::get('/GetAllFlights', [AirLineController::class, 'get_all_flights']);
  Route::get('/DeleteFlight/{flight_id}', [AirLineController::class, 'delete_flight']);
  
  //3. reservations
  Route::get('/GetFlightReservations/{flight_id}', [AirLineController::class, 'get_flight_reservations']);
  Route::get('/GetAllReservations', [AirLineController::class, 'get_all_reservations']);
  Route::post('/SearchReservationsByName', [AirLineController::class, 'search_reservations_by_name']);  
  
  // General Tasks
  Route::get('/GetEvaluation', [AirLineController::class, 'get_evaluation']);
  Route::post('/AddPicture', [GeneralTaskController::class, 'add_picture']);
  Route::get('/DeletePicture/{picture_id}', [GeneralTaskController::class, 'delete_picture']);
  Route::post('/AddService', [GeneralTaskController::class, 'add_service']);
  Route::get('/DeleteService/{service_id}', [GeneralTaskController::class, 'delete_service']);

  // Accommodation
  Route::get('/ShowAccommodationRecords', [AccommodationController::class, 'show_records']);
  Route::post('/FilterNameAccommodation', [AccommodationController::class, 'filter_name_accommodation']);
  Route::get('/ShowOffers', [AccommodationController::class, 'show_offers']);
  Route::get('/ShowAllRooms', [AccommodationController::class, 'show_all_rooms']);
  Route::get('/ShowRoomRecords/{id}', [AccommodationController::class, 'show_room_records']);
  Route::get('/ShowRoom/{id}', [AccommodationController::class, 'show_room']);
  Route::post('/AddRoom', [AccommodationController::class, 'add_room']);
  Route::post('/EditRoom/{id}', [AccommodationController::class, 'edit_room']);
  Route::get('/DeleteRoom/{id}', [AccommodationController::class, 'delete_room']);

});
