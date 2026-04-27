<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryImage;
use App\Models\LandingContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stories = Story::with('images')->latest()->get();
        $contents = LandingContent::where('key', 'like', 'story_%')->pluck('value', 'key');

        return Inertia::render('stories/index', [
            'stories' => $stories,
            'contents' => $contents
        ]);
    }

    /**
     * Update global story headline and description.
     */
    public function updateContent(Request $request)
    {
        $request->validate([
            'story_headline' => 'required|string|max:255',
            'story_description' => 'required|string',
        ]);

        LandingContent::updateOrCreate(['key' => 'story_headline'], ['value' => $request->story_headline]);
        LandingContent::updateOrCreate(['key' => 'story_description'], ['value' => $request->story_description]);

        return redirect()->back()->with('success', 'Story section headline updated successfully.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'time' => 'required|string|max:255',
            'images.*' => 'nullable|image|max:2048',
        ]);

        $story = Story::create([
            'title' => $request->title,
            'description' => $request->desc,
            'time' => $request->time,
        ]);

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            foreach (array_slice($files, 0, 3) as $file) {
                $path = $file->store('stories', 'public');
                StoryImage::create([
                    'story_id' => $story->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Story item created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $story = Story::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'desc' => 'required|string',
            'time' => 'required|string|max:255',
            'images.*' => 'nullable|image|max:2048',
            'deleted_images' => 'nullable|array',
        ]);

        $story->update([
            'title' => $request->title,
            'description' => $request->desc,
            'time' => $request->time,
        ]);

        if ($request->deleted_images) {
            foreach ($request->deleted_images as $imageId) {
                $image = StoryImage::find($imageId);
                if ($image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }
        }

        if ($request->hasFile('images')) {
            $currentCount = $story->images()->count();
            $files = $request->file('images');
            foreach (array_slice($files, 0, 3 - $currentCount) as $file) {
                $path = $file->store('stories', 'public');
                StoryImage::create([
                    'story_id' => $story->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Story item updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $story = Story::findOrFail($id);
        foreach ($story->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $story->delete();

        return redirect()->back()->with('success', 'Story item deleted successfully.');
    }

    /**
     * API for landing page.
     */
    public function apiIndex()
    {
        $stories = Story::with('images')->latest()->get();
        $contents = LandingContent::where('key', 'like', 'story_%')->pluck('value', 'key');
        return response()->json([
            'stories' => $stories,
            'contents' => $contents
        ]);
    }
}
