<?php

namespace App\Http\Controllers;

use App\Models\LandingContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class LandingContentController extends Controller
{
    /**
     * Display the CMS page for landing content.
     */
    public function index()
    {
        $contents = LandingContent::all()->pluck('value', 'key');
        return Inertia::render('landing-content', [
            'contents' => $contents
        ]);
    }

    /**
     * Update landing contents.
     */
    public function update(Request $request)
    {
        $data = $request->validate([
            'contents' => 'required|array',
        ]);

        foreach ($data['contents'] as $key => $value) {
            LandingContent::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return redirect()->back()->with('success', 'Landing content updated successfully.');
    }

    /**
     * API endpoint for the landing page.
     */
    public function apiIndex()
    {
        $contents = LandingContent::all()->pluck('value', 'key');
        return response()->json($contents);
    }
    
    /**
     * Upload an image for the landing page.
     */
    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:2048',
            'key' => 'required|string',
        ]);

        $path = $request->file('image')->store('landing', 'public');
        
        LandingContent::updateOrCreate(
            ['key' => $request->key],
            ['value' => Storage::url($path), 'type' => 'image']
        );

        return response()->json(['url' => Storage::url($path)]);
    }
}
