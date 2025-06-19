<?php

namespace App\Http\Controllers;

use App\Models\Accommodation_type;
use App\Models\Car_type;
use App\Models\Country;
use App\Models\Owner_category;
use App\Models\Plan_type;
use Illuminate\Http\Request;

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


}
