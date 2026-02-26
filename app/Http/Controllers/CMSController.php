<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CMSController extends Controller
{
    public function cImageUpdater(Request $request)
    {
        if ($request->hasFile('image')) {
            $imageFile = $request->file('image');
            try {
                DB::transaction(function () use ($request, $imageFile) {
                    $sanitizedName = '';
                    switch ($request->input('position')) {
                        case '1':
                            $sanitizedName = 'carousel-image-1'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '2':
                            $sanitizedName = 'carousel-image-2'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '3':
                            $sanitizedName = 'carousel-image-3'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '4':
                            $sanitizedName = 'carousel-image-4'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        case '5':
                            $sanitizedName = 'carousel-image-5'.'.'.$imageFile->getClientOriginalExtension();
                            break;
                        default:
                            abort(500);
                    }

                    if (Storage::disk('public')->exists('home/carousel'.'/'.$sanitizedName)) {
                        Storage::disk('public')->delete('home/carousel'.'/'.$sanitizedName);
                    }

                    $imageFile->storeAs('home/carousel', $sanitizedName, 'public');
                });
                return redirect()->route('dashboard');
            } catch (\Exception $e) {
                dd($e);
            }
        }
    }

    public function projectSaver(Request $request)
    {
        dd($request->all());
    }
}
