# Backend Update Instructions for Google OAuth

## Update your SocialController.php

Replace the `handleGoogleCallback()` method with this updated version:

```php
{{ ... }}

## Important Notes:

1. Make sure your frontend is running on `http://localhost:3000`
2. If your frontend runs on a different port, update the `$redirectUrl` accordingly
3. The backend will      // Redirect to frontend with user data as URL parameters
      $redirectUrl = 'http://localhost:3000/auth?' . http_build_query([
        'auth_success' => 'true',
        'token' => $new_user['token'],
        'name' => $new_user->name,
        'email' => $new_user->email,
        'id' => $new_user->id,
        'role_id' => $new_user->role_id,
        'role'=>'user'
      ]);Frontend detects the callback parameters and logs the user in
5. User gets redirected to home page ("/")

## How it works:

1. User clicks Google login button
{{ ... }}
3. Backend handles Google OAuth and redirects back to frontend with user data
4. Frontend detects the callback parameters and logs the user in
5. User gets redirected to home page ("/")
