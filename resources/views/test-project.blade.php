<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create New Project</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .dropzone { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .dropzone:hover { border-color: rgb(139 92 246); }
    </style>
</head>
<body class="bg-zinc-950 text-zinc-200 min-h-screen py-12">
<div class="max-w-5xl mx-auto px-6">
    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">
        <h1 class="text-4xl font-bold tracking-tight mb-2">Create New Project</h1>
        <p class="text-zinc-400 mb-10">Fill in all project details</p>

        <form method="POST" action="{{route('add-project')}}" enctype="multipart/form-data" class="space-y-12">
            @csrf

            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Project ID <span class="text-red-500">*</span></label>
                    <input type="text" name="project_id" required class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Project Name <span class="text-red-500">*</span></label>
                    <input type="text" name="name" required class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Project Type <span class="text-red-500">*</span></label>
                    <select name="project_type_id" required class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                        <option value="" selected>Select Type</option>
                        @foreach($types as $type)
                            <option value="{{$type->id}}">{{$type->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Location <span class="text-red-500">*</span></label>
                    <select name="location" required class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                        <option value="" selected>Select Location</option>
                        @foreach($locations as $location)
                            <option value="{{$location->id}}">{{$location->name}}</option>
                        @endforeach
                    </select>
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Full Address</label>
                    <input type="text" name="address" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Google Map URL</label>
                    <input type="url" name="google_map_url" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>

                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Price (AED)</label>
                    <input type="number" name="price" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Size (sqft)</label>
                    <input type="text" name="size" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Floors</label>
                    <input type="text" name="floors" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500">
                </div>
            </div>

            <!-- Dates & Featured -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Construction Start</label>
                    <input type="date" name="construction_start_date" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4">
                </div>
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Handover Date</label>
                    <input type="date" name="handover_date" class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4">
                </div>
                <div class="flex items-center gap-3 pt-8">
                    <input type="checkbox" name="isFeatured" id="featured" value="1" class="w-5 h-5 accent-violet-600">
                    <label for="featured" class="cursor-pointer">Mark as Featured Project</label>
                </div>
            </div>

            <!-- Description & Surroundings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Description</label>
                    <textarea name="description" rows="5" class="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-2">Surroundings</label>
                    <textarea name="surroundings" rows="5" class="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4"></textarea>
                </div>
            </div>

            <!-- Media Section -->
            <div class="border-t border-zinc-700 pt-10">
                <h2 class="text-2xl font-semibold mb-8">Project Images</h2>

                <!-- Thumbnail -->
                <div class="mb-12">
                    <label class="block text-sm font-medium text-zinc-400 mb-3">Project Thumbnail (Single Image)</label>
                    <div id="thumbnail-dropzone"
                         class="dropzone relative aspect-video bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">
                        <div id="thumbnail-prompt" class="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                            </svg>
                            <p class="mt-4 text-white">Drop thumbnail here or click to upload</p>
                        </div>
                        <img id="thumbnail-preview" class="hidden absolute inset-0 w-full h-full object-cover rounded-3xl">
                    </div>
                    <input type="file" id="thumbnail-input" name="thumbnail" accept="image/*" class="hidden">
                </div>

                <!-- Multiple Project Images -->
                <div>
                    <label class="block text-sm font-medium text-zinc-400 mb-3">Project Images (Multiple)</label>
                    <div id="multiple-dropzone"
                         class="dropzone relative border-2 border-dashed border-zinc-700 rounded-3xl p-10 text-center cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 mx-auto text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <p class="mt-4 text-white">Drop multiple images here or click to select</p>
                    </div>
                    <input type="file" id="multiple-input" name="project_images[]" accept="image/*" multiple class="hidden">

                    <!-- Selected files list -->
                    <div id="selected-files" class="mt-6 space-y-2"></div>
                </div>
            </div>

            <button type="submit"
                    class="w-full bg-violet-600 hover:bg-violet-700 py-6 rounded-3xl text-xl font-semibold mt-8">
                Create Project
            </button>
        </form>
    </div>
</div>

<script>
    // Thumbnail Preview
    const thumbDrop = document.getElementById('thumbnail-dropzone');
    const thumbInput = document.getElementById('thumbnail-input');
    const thumbPreview = document.getElementById('thumbnail-preview');
    const thumbPrompt = document.getElementById('thumbnail-prompt');

    thumbDrop.addEventListener('click', () => thumbInput.click());
    thumbInput.addEventListener('change', e => {
        if (e.target.files[0]) handleImagePreview(e.target.files[0], thumbPreview, thumbPrompt);
    });

    // Multiple Images
    const multiDrop = document.getElementById('multiple-dropzone');
    const multiInput = document.getElementById('multiple-input');
    const fileList = document.getElementById('selected-files');

    multiDrop.addEventListener('click', () => multiInput.click());
    multiInput.addEventListener('change', () => showSelectedFiles());

    function handleImagePreview(file, previewImg, promptDiv) {
        const reader = new FileReader();
        reader.onload = ev => {
            previewImg.src = ev.target.result;
            previewImg.classList.remove('hidden');
            promptDiv.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    function showSelectedFiles() {
        fileList.innerHTML = '';
        Array.from(multiInput.files).forEach((file, i) => {
            const div = document.createElement('div');
            div.className = "bg-zinc-800 rounded-2xl px-5 py-3 flex justify-between items-center";
            div.innerHTML = `
                    <span class="text-sm">${file.name}</span>
                    <span class="text-xs text-emerald-400">Selected</span>
                `;
            fileList.appendChild(div);
        });
    }

    // Drag & Drop support for both zones
    [thumbDrop, multiDrop].forEach(zone => {
        zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('border-violet-500'); });
        zone.addEventListener('dragleave', () => zone.classList.remove('border-violet-500'));
        zone.addEventListener('drop', e => {
            e.preventDefault();
            zone.classList.remove('border-violet-500');
            if (zone.id === 'thumbnail-dropzone' && e.dataTransfer.files[0]) {
                thumbInput.files = e.dataTransfer.files;
                handleImagePreview(e.dataTransfer.files[0], thumbPreview, thumbPrompt);
            } else if (zone.id === 'multiple-dropzone') {
                multiInput.files = e.dataTransfer.files;
                showSelectedFiles();
            }
        });
    });
</script>
</body>
</html>