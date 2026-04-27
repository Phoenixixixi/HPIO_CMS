<?php

namespace App\Http\Controllers;

use App\Models\track_intern;
use App\Models\track_intern_member;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TrackInternController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $interns = track_intern::with('members')->latest()->get();
        return Inertia::render('interns/index', [
            'interns' => $interns
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'Batch' => 'required|string|max:255',
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'achievement_title' => 'required|string|max:255',
            'achievement_description' => 'required|string',
            'members' => 'required|array|min:1',
            'members.*.name' => 'required|string|max:255',
            'members.*.nim' => 'required|string|max:50',
            'members.*.major' => 'required|string|max:255',
            'members.*.university' => 'required|string|max:255',
            'members.*.work_place' => 'required|string|max:255',
            'members.*.job_desk' => 'required|string|max:255',
            'members.*.image' => 'nullable|image|max:2048',
        ]);

        $intern = track_intern::create([
            'Batch' => $request->Batch,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'achievement_title' => $request->achievement_title,
            'achievement_description' => $request->achievement_description,
        ]);

        foreach ($request->members as $index => $memberData) {
            $imagePath = '';
            if ($request->hasFile("members.$index.image")) {
                $imagePath = $request->file("members.$index.image")->store('interns', 'public');
            }

            $intern->members()->create([
                'name' => $memberData['name'],
                'nim' => $memberData['nim'],
                'major' => $memberData['major'],
                'university' => $memberData['university'],
                'work_place' => $memberData['work_place'],
                'job_desk' => $memberData['job_desk'],
                'image' => $imagePath,
            ]);
        }

        return redirect()->back()->with('success', 'Intern batch created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $intern = track_intern::findOrFail($id);

        $request->validate([
            'Batch' => 'required|string|max:255',
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'achievement_title' => 'required|string|max:255',
            'achievement_description' => 'required|string',
            'members' => 'required|array|min:1',
        ]);

        $intern->update([
            'Batch' => $request->Batch,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'achievement_title' => $request->achievement_title,
            'achievement_description' => $request->achievement_description,
        ]);

        // Simple approach: Delete old members and create new ones, 
        // OR update existing ones. Let's do update/create/delete logic.
        $existingMemberIds = $intern->members->pluck('id')->toArray();
        $newMemberIds = [];

        foreach ($request->members as $index => $memberData) {
            $data = [
                'name' => $memberData['name'],
                'nim' => $memberData['nim'],
                'major' => $memberData['major'],
                'university' => $memberData['university'],
                'work_place' => $memberData['work_place'],
                'job_desk' => $memberData['job_desk'],
            ];

            if ($request->hasFile("members.$index.image")) {
                // Delete old image if exists
                if (!empty($memberData['id'])) {
                    $oldMember = track_intern_member::find($memberData['id']);
                    if ($oldMember && $oldMember->image) {
                        Storage::disk('public')->delete($oldMember->image);
                    }
                }
                $data['image'] = $request->file("members.$index.image")->store('interns', 'public');
            }

            if (!empty($memberData['id'])) {
                $member = track_intern_member::find($memberData['id']);
                if ($member) {
                    $member->update($data);
                    $newMemberIds[] = $member->id;
                }
            } else {
                $newMember = $intern->members()->create($data);
                $newMemberIds[] = $newMember->id;
            }
        }

        // Delete members that are no longer in the list
        $membersToDelete = array_diff($existingMemberIds, $newMemberIds);
        foreach ($membersToDelete as $idToDelete) {
            $member = track_intern_member::find($idToDelete);
            if ($member) {
                if ($member->image) {
                    Storage::disk('public')->delete($member->image);
                }
                $member->delete();
            }
        }

        return redirect()->back()->with('success', 'Intern batch updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $intern = track_intern::findOrFail($id);
        foreach ($intern->members as $member) {
            if ($member->image) {
                Storage::disk('public')->delete($member->image);
            }
        }
        $intern->delete();

        return redirect()->back()->with('success', 'Intern batch deleted successfully.');
    }

    /**
     * API for landing page.
     */
    public function apiIndex()
    {
        $interns = track_intern::with('members')->latest()->get();
        return response()->json($interns);
    }
}
