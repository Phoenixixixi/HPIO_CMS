<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::with('users_profile')->get();
        return Inertia::render('structure', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'status' => 'required|string',
            'description_profile' => 'nullable|string',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'team' => 'required|string',
            'role' => 'required|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto_profile')) {
            $fotoPath = $request->file('foto_profile')->store('profiles', 'public');
        }

        UserProfile::create([
            'user_id' => $user->id,
            'nama' => $request->name, // Assuming nama in profile matches name in user
            'status' => $request->status,
            'foto_profile' => $fotoPath,
            'description_profile' => $request->description_profile,
            'team' => $request->team,
            'role' => $request->role,
        ]);

        return redirect()->back()->with('success', 'User created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'status' => 'required|string',
            'description_profile' => 'nullable|string',
            'foto_profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'team' => 'required|string',
            'role' => 'required|string',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->filled('password')) {
            $user->update(['password' => Hash::make($request->password)]);
        }

        $profile = $user->users_profile;
        $fotoPath = $profile ? $profile->foto_profile : null;

        if ($request->hasFile('foto_profile')) {
            // Delete old photo if exists
            if ($fotoPath) {
                Storage::disk('public')->delete($fotoPath);
            }
            $fotoPath = $request->file('foto_profile')->store('profiles', 'public');
        }

        if ($profile) {
            $profile->update([
                'nama' => $request->name,
                'status' => $request->status,
                'foto_profile' => $fotoPath,
                'description_profile' => $request->description_profile,
                'team' => $request->team,
                'role' => $request->role,
            ]);
        } else {
             UserProfile::create([
                'user_id' => $user->id,
                'nama' => $request->name,
                'status' => $request->status,
                'foto_profile' => $fotoPath,
                'description_profile' => $request->description_profile,
                'team' => $request->team,
                'role' => $request->role,
            ]);
        }

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->users_profile && $user->users_profile->foto_profile) {
            Storage::disk('public')->delete($user->users_profile->foto_profile);
        }
        
        $user->delete();

        return redirect()->back()->with('success', 'User deleted successfully.');
    }

    public function getAPIUser()
    {
        $users = User::join('users_profile', 'users.id', '=', 'users_profile.user_id')
            ->select(
                'users.name', 
                'users.email', 
                'users_profile.status', 
                'users_profile.foto_profile', 
                'users_profile.description_profile',
                'users_profile.team',
                'users_profile.role'
            )
            ->get();

        return response()->json($users);
    }
}
