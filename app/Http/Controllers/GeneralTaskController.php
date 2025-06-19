<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Accommodation_type;
use App\Models\Activity_owner;
use App\Models\Air_line;
use App\Models\Car_picture;
use App\Models\Car_type;
use App\Models\Country;
use App\Models\Owner;
use App\Models\Owner_category;
use App\Models\Owner_service;
use App\Models\Package;
use App\Models\Package_element;
use App\Models\Picture;
use App\Models\Plan_type;
use App\Models\Room;
use App\Models\Room_picture;
use App\Models\Service;
use App\Models\Tourism_company;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Vehicle_owner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GeneralTaskController extends Controller
{
  public function get_all_owners_categories()
  {
    $owners_category = Owner_category::query()->get();
    return response()->json([
      'owners_categories' => $owners_category
    ]);
  }

  public function get_all_countries()
  {
    $country = Country::query()->get();
    return response()->json([
      'countries' => $country
    ]);
  }

  public function get_all_accommodation_types()
  {
    $accommodation_type = Accommodation_type::query()->get();
    return response()->json([
      'accommodation_types' => $accommodation_type
    ]);
  }

  public function get_all_car_types()
  {
    $car_type = Car_type::query()->get();
    return response()->json([
      'car_types' => $car_type
    ]);
  }

  public function get_all_plane_types()
  {
    $plane_type = Plan_type::query()->get();
    return response()->json([
      'plane_types' => $plane_type
    ]);
  }

  public function get_all_services()
  {
    $service = Service::query()->get();
    return response()->json([
      'services' => $service
    ]);
  }


  public function show_profile()
  {
    $user = Auth::user();
    $id = $user->id;

    if ($user['role_id'] == 3) {
      $data['user'] = $user;
      return response()->json($data);
    }

    $data = [];
    $owner = Owner::query()->where('user_id', $id)->first();
    $data['owner'] = $owner;
    $data['user'] = User::query()->where('id', $owner->user_id)->first();

    $category_id = $owner->owner_category_id;
    $data['pictures'] = Picture::query()->where('owner_id', $owner->id)->get();
    $ffs = Owner_service::query()->where('owner_id', $owner->id)->get();
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
      
      $packages = Package::query()->where('tourism_company_id', $tourism->id)->get();
      
      $packagesWithElements  = $packages->map(function ($package) {
        $package['element'] = Package_element::query()->where('package_id', $package->id)->get();
        return $package;
      });
      $data['packages'] = $packagesWithElements;
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


}
