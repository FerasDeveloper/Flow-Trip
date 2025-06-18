<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Accommodation_type;
use App\Models\Activity;
use App\Models\Activity_owner;
use App\Models\Air_line;
use App\Models\Auth_request;
use App\Models\Car_picture;
use App\Models\Car_type;
use App\Models\Owner;
use App\Models\Owner_service;
use App\Models\Picture;
use App\Models\Room;
use App\Models\Service;
use App\Models\Tourism_company;
use App\Models\User;
use App\Models\Vehicle_owner;
use App\Models\Room_picture;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{

  public function get_all_requests()
  {
    $requests = Auth_request::query()->get();
    $data = [];

    foreach ($requests as $request) {
      $user = User::query()->where('id', $request->user_id)->first();
      $data[] = [
        'request' => $request,
        'user_name' => $user->name
      ];
    }

    return response()->json($data);
  }

  public function show_request($id)
  {
    $data = [];
    $request = Auth_request::query()->where('id', $id)->first();
    $user = User::query()->where('id', $request->user_id)->first();
    $data[] = [
      'request' => $request,
      'user_name' => $user->name
    ];
    return response()->json(
      $data[0]
    );
  }

  public function edit_request(Request $request, $id)
  {

    $user = Auth::user();
    $ts = Auth_request::query()->where('id', $id)->first();
    if (!in_array($user['role_id'], [1, 2])) {
      return response()->json([
        'message' => 'Authourization required'
      ]);
    }

    $update = Auth_request::query()->where('id', $id)->update([
      'activity_name' => $request->activity_name
    ]);

    if ($update) {
      return response()->json([
        'message' => 'Request updated successfully'
      ]);
    }
  }

  public function accept_request($id)
  {
    $user = Auth::user();
    $request = Auth_request::query()->where('id', $id)->first();

    if (!in_array($user['role_id'], [1, 2])) {
      return response()->json([
        'message' => 'Authorization required'
      ]);
    }

    $owner = Owner::query()->create([
      'location' => $request->location,
      'country_id' => $request->country_id,
      'description' => $request->description,
      'user_id' => $request->user_id,
      'owner_category_id' => $request->owner_category_id,
    ]);

    $id = $request->owner_category_id;
    switch ($id) {
      case '1':
        $accommodation_type = Accommodation_type::query()->where('name', $request->accommodation_type)->first();
        if (!$accommodation_type) {
          $accommodation_type = Accommodation_type::query()->create([
            'name' => $request->accommodation_type
          ]);
        }
        $owner['more'] = Accommodation::query()->create([
          'owner_id' => $owner->id,
          'accommodation_type_id' => $accommodation_type->id,
        ]);
        break;

      case '2':
        $owner['more'] = Air_line::query()->create([
          'owner_id' => $owner->id,
          'air_line_name' => $request->business_name
        ]);
        break;

      case '3':
        $owner['more'] = Tourism_company::query()->create([
          'owner_id' => $owner->id,
          'company_name' => $request->business_name
        ]);
        break;

      case '4':
        $owner['more'] = Vehicle_owner::query()->create([
          'owner_id' => $owner->id,
          'owner_name' => $request->business_name
        ]);
        break;

      case '5':
        $activity = Activity::query()->where('name', $request->activity_name)->first();
        if (!$activity) {
          $activity = Activity::query()->create([
            'name' => $request->activity_name
          ]);
        }
        $owner['more'] = Activity_owner::query()->create([
          'owner_id' => $owner->id,
          'owner_name' => $request->business_name,
          'activity_id' => $activity->id
        ]);
        break;

      default:
        break;
    }

    $user0 = User::query()->where('id', $request->user_id)->first();
    $user0->update([
      'status' => 0
    ]);

    $request->delete();
    return response()->json([
      'message' => 'Request accepted successfully',
      'data' => $owner
    ]);
  }

  public function delete_request($id)
  {

    $user = Auth::user();
    $request = Auth_request::query()->where('id', $id)->first();
    if (!in_array($user['role_id'], [1, 2])) {
      return response()->json([
        'message' => 'Authourization required'
      ]);
    }

    $user0 = User::query()->where('id', $request->user_id)->first();
    $delete = $request->delete();
    $delete0 = $user0->delete();
    if ($delete && $delete0) {
      return response()->json([
        'message' => 'Request deleted successfully'
      ]);
    }
    return response()->json([
      'message' => 'Something went wrong'
    ]);
  }

  public function get_all_owners()
  {

    $owners = Owner::query()->get();
    return response()->json(
      $owners
    );
  }

  public function show_owner($id)
  {
    $data = [];
    $owner = Owner::query()->where('id', $id)->first();
    $data['owner'] = $owner;
    $owner['user'] = User::query()->where('id', $owner->user_id)->first();

    $category_id = $owner->owner_category_id;
    $data['pictures'] = Picture::query()->where('owner_id', $id)->get();
    $ffs = Owner_service::query()->where('owner_id', $id)->get();
    $data['services'] = [];

    foreach ($ffs as $ff) {
      $service = Service::query()->where('id', $ff->service_id)->first();
      $data['services'][] = $service;
    }

    if ($category_id == 1) {
      $accommodation = Accommodation::query()->where('owner_id', $owner->id)->first();
      $accommodation_type = Accommodation_type::query()->where('id', $accommodation->accommodation_type_id)->first();

      $data['details'] = [
        'accommodation' => $accommodation,
        'accommodation_type' => $accommodation_type->name
      ];

      if ($accommodation_type->name == 'Hotel') {
        $rooms = Room::query()->where('accommodation_id', $accommodation->id)->get();


        $roomsWithPictures = $rooms->map(function ($room) {
          $room['pictures'] = Room_picture::query()->where('room_id', $room->id)->get();
          return $room;
        });

        $data['rooms'] = $roomsWithPictures;
      }
    } else if ($category_id == 2) {
      $air_line = Air_line::query()->where('owner_id', $owner->id)->first();
      $data['details'] = $air_line;
    } else if ($category_id == 3) {
      $tourism = Tourism_company::query()->where('owner_id', $owner->id)->first();
      $data['details'] = $tourism;
    } else if ($category_id == 4) {
      $vehicle_owner = Vehicle_owner::query()->where('owner_id', $owner->id)->first();
      $data['details'] = $vehicle_owner;

      $vehicles = Vehicle::query()->where('vehicle_owner_id', $vehicle_owner->id)->get();

      $vehiclesWithPictures = $vehicles->map(function ($vehicle) {
        $vehicle['pictures'] = Car_picture::query()->where('vehicle_id', $vehicle->id)->get();
        $f = Car_type::query()->where('id', $vehicle->car_type_id)->first();
        $vehicle['car_type'] = $f->name;
        return $vehicle;
      });

      $data['vehicles'] = $vehiclesWithPictures;
    } else if ($category_id == 5) {
      $activity_owner = Activity_owner::query()->where('owner_id', $owner->id)->first();
      $data['details'] = $activity_owner;
    }

    return response()->json($data);
  }

  public function block($id)
  {

    $user = Auth::user();
    if (!in_array($user['role_id'], [1, 2])) {
      return response()->json([
        'message' => 'Authourization required'
      ]);
    }

    $selected_user = User::query()->where('id', $id)->first();
    if ($selected_user->status == 2) {
      $selected_user->update([
        'status' => 0
      ]);
      return response()->json([
        'message' => 'User unblocked successfully'
      ]);
    } else if ($selected_user->status == 0) {
      $selected_user->update([
        'status' => 2
      ]);
      return response()->json([
        'message' => 'User blocked successfully'
      ]);
    }
  }

  public function filter_by_category(Request $request)
  {

    $owners = Owner::query()->where('owner_category_id', $request->id)->get();

    $data = [];
    foreach ($owners as $owner) {
      $ownerData = [
        'owner' => $owner,
        'user' => User::query()->where('id', $owner->user_id)->first()
      ];

      switch ($request->id) {
        case '1':
          $accommodation = Accommodation::query()->where('owner_id', $owner->id)->first();
          $accommodation_type = Accommodation_type::query()->where('id', $accommodation->accommodation_type_id)->first();
          $ownerData['details'] = [
            'accommodation' => $accommodation,
            'accommodation_type' => $accommodation_type->name
          ];
          break;
        case '2':
          $air_line = Air_line::query()->where('owner_id', $owner->id)->first();
          $ownerData['details'] = $air_line;
          break;
        case '3':
          $tourism = Tourism_company::query()->where('owner_id', $owner->id)->first();
          $ownerData['details'] = $tourism;
          break;
        case '4':
          $vehicle_owner = Vehicle_owner::query()->where('owner_id', $owner->id)->first();
          $ownerData['details'] = $vehicle_owner;
          break;
        case '5':
          $activity_owner = Activity_owner::query()->where('owner_id', $owner->id)->first();
          $ownerData['details'] = $activity_owner;
          break;
      }
      $data[] = $ownerData;
    }

    return response()->json($data);
  }
}
