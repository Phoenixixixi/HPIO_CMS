<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\WorkImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class WorkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $works = Work::with('images')->latest()->get();
        return Inertia::render('works', [
            'works' => $works
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $work = Work::create([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        if ($request->hasFile('images')) {
            $files = $request->file('images');
            // Max 4 pictures as requested
            foreach (array_slice($files, 0, 4) as $file) {
                $path = $file->store('works', 'public');
                WorkImage::create([
                    'work_id' => $work->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Work created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Work $work)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'deleted_images' => 'nullable|array',
        ]);

        $work->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        // Delete requested images
        if ($request->deleted_images) {
            foreach ($request->deleted_images as $imageId) {
                $image = WorkImage::find($imageId);
                if ($image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }
        }

        // Add new images if under limit
        if ($request->hasFile('images')) {
            $currentCount = $work->images()->count();
            $files = $request->file('images');
            foreach (array_slice($files, 0, 4 - $currentCount) as $file) {
                $path = $file->store('works', 'public');
                WorkImage::create([
                    'work_id' => $work->id,
                    'image_path' => $path,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Work updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Work $work)
    {
        foreach ($work->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }
        $work->delete();

        return redirect()->back()->with('success', 'Work deleted successfully.');
    }

    /**
     * API for landing page.
     */
    public function apiIndex()
    {
        $works = Work::with('images')->latest()->get();
        return response()->json($works);
    }
}
