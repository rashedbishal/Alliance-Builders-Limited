<?php

namespace App\Http\Middleware;

use App\Models\Config\SiteSetting;
use App\Models\Properties\Project;
use App\Models\Releases\Popup;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'isPopupEnabled' => function () {
                return Popup::value('isEnabled') ?? false;
            },
            'popupImgUrl' => function () {
                return Popup::value('imagePath') ?? false;
            },
            'navHotels' => function () {
                return Project::where('project_type_id', 4)
                    ->select('id', 'name', 'slug')
                    ->orderBy('name')
                    ->get();
            },
            'siteSettings' => function () {
                return SiteSetting::find(1);
            },
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
