<?php

namespace App\Http\Controllers;

use App\Models\Accommodation;
use App\Models\Accommodation_type;
use App\Models\Owner;
use App\Models\Room;
use App\Models\Room_picture;
use App\Models\User;
use App\Models\User_accommodation;
use App\Models\User_room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AccommodationController extends Controller
{

  public function show_records()
  {

    $user = Auth::user();
    $owner = Owner::query()->where('user_id', $user->id)->first();
    $accommodation = Accommodation::query()->where('owner_id', $owner->id)->first();
    $accommodation_type = Accommodation_type::query()->where('id', $accommodation->accommodation_type_id)->select('name')->first();
    $data = [];

    if ($accommodation_type->name == "Hotel") {
      $rooms = Room::query()->where('accommodation_id', $accommodation->id)->get();

      $roomsWithData = $rooms->map(function ($room) {
        $room['pictures'] = Room_picture::query()->where('room_id', $room->id)->get();
        $customersIds = User_room::query()->where('room_id', $room->id)->pluck('user_id')->toArray();
        $room['customers'] = User::query()->whereIn('id', $customersIds)->get();
        return $room;
      });
      $data['rooms'] = $roomsWithData;

      return response()->json(
        $data
      );
    }

    $user_accommodations = User_accommodation::query()->where('accommodation_id', $accommodation->id)->get();

    $details = $user_accommodations->map(function ($user_accommodation) {
      $user_accommodation['user'] = User::query()->where('id', $user_accommodation->user_id)->first();
      return $user_accommodation;
    });
    $data['details'] = $details;

    return response()->json(
      $data
    );
  }

  public function filter_name_accommodation(Request $request)
  {
    $name = $request->input('name');
    $user = Auth::user();
    $owner = Owner::query()->where('user_id', $user->id)->first();
    $accommodation = Accommodation::query()->where('owner_id', $owner->id)->first();
    $accommodation_type = Accommodation_type::query()->where('id', $accommodation->accommodation_type_id)->select('name')->first();
    $data = [];

    if ($accommodation_type->name == "Hotel") {
      $rooms = Room::query()->where('accommodation_id', $accommodation->id)->get();

      // جمع كل المستخدمين في Collection واحدة
      $allUsers = collect();
      foreach ($rooms as $room) {
        $customersIds = User_room::query()->where('room_id', $room->id)->pluck('user_id')->toArray();
        $users = User::query()->whereIn('id', $customersIds)->get();
        $allUsers = $allUsers->merge($users);
      }

      if ($name) {
        $filteredUsers = $allUsers->filter(function ($user) use ($name) {
          return stripos($user->name, $name) !== false;
        })->values();
      } else {
        $filteredUsers = $allUsers->values();
      }

      $data['filtered_users'] = $filteredUsers;

      return response()->json($data);
    }

    $user_accommodations = User_accommodation::query()->where('accommodation_id', $accommodation->id)->pluck('user_id')->toArray();

    $users = User::query()->whereIn('id', $user_accommodations)->get();
    if ($name) {
      $filteredUsers = $users->filter(function ($user) use ($name) {
        return stripos($user->name, $name) !== false;
      })->values();
    } else {
      $filteredUsers = $users->values();
    }

    $data['filtered_users'] = $filteredUsers;

    return response()->json($data);
  }

  public function add_room(Request $request)
  {

    $user = Auth::user();
    $owner = Owner::query()->where('user_id', $user->id)->first();
    $accommodation = Accommodation::query()->where('owner_id', $owner->id)->first();

    $request->validate([
      'price' => 'required|numeric|min:1',
      'area' => 'required|numeric|min:1',
      'people_count' => 'required|integer|min:1',
      'description' => 'required',
    ], [
      'price.min' => 'The price must be a positive value greater than zero.',
      'area.min' => 'The area must be a positive value greater than zero.',
      'people_count.min' => 'The number of people must be a positive value greater than zero.',
    ]);

    $room = Room::query()->create([
      'accommodation_id' => $accommodation->id,
      'price' => $request->price,
      'area' => $request->area,
      'people_count' => $request->people_count,
      'description' => $request->description,
    ]);

    if ($request->hasFile('images')) {
      foreach ($request->file('images') as $image) {
        $imagePath = $image->store('images', 'public');
        Room_picture::query()->create([
          'room_id' => $room->id,
          'room_picture' => asset('storage/' . $imagePath)
        ]);
      }
    }

    return response()->json([
      'message' => 'Room added successfully'
    ]);
  }
}
