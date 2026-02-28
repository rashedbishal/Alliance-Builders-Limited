<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Gallery Media</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .dropzone { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .dropzone:hover { border-color: rgb(139 92 246); }
    </style>
</head>
<body class="bg-zinc-950 text-zinc-200 min-h-screen py-12">

<div class="max-w-4xl mx-auto px-6">
    <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

        <h1 class="text-4xl font-bold tracking-tight mb-2">Upload Gallery Media</h1>
        <p class="text-zinc-400 mb-10">Add images or videos to the gallery</p>

        <form method="POST" action="{{ route('add-gallery') }}" enctype="multipart/form-data" class="space-y-10">

            @csrf

            <!-- Gallery Type -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Gallery Type <span class="text-red-500">*</span>
                </label>
                <select name="gallery_type" required
                        class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition">
                    <option value="" disabled selected>Select type</option>
                    @foreach($types as $type)
                        <option value="{{$type->id}}">{{$type->type}}</option>
                    @endforeach
                </select>
            </div>

            <!-- Media Type -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Media Type <span class="text-red-500">*</span>
                </label>
                <select name="media_type" id="media-type-select" required
                        class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition">
                    <option value="" disabled selected>Select type</option>
                    <option value="1">Image</option>
                    <option value="2">Video</option>
                </select>
            </div>

            <!-- Title -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Title
                </label>
                <input type="text" name="title"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition"
                       placeholder="Enter media title">
            </div>

            <!-- Description -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Description
                </label>
                <textarea name="description" rows="4"
                          class="w-full bg-zinc-800 border border-zinc-700 rounded-3xl px-5 py-4 focus:border-violet-500 focus:outline-none transition resize-none"
                          placeholder="Enter media description (up to 512 characters)"></textarea>
            </div>

            <!-- Upload Field -->
            <div class="border-t border-zinc-700 pt-8">
                <label class="block text-sm font-medium text-zinc-400 mb-3">
                    Upload Image/Video <span class="text-red-500">*</span>
                </label>

                <div id="media-dropzone"
                     class="dropzone relative aspect-video bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">

                    <div id="media-prompt" class="text-center px-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <p class="mt-4 text-white font-medium">Drop file here or click to select</p>
                        <p class="mt-1 text-sm text-zinc-500">Image: JPG/PNG/WEBP • Video: MP4/MOV</p>
                    </div>

                    <img id="media-preview-img" class="hidden absolute inset-0 w-full h-full object-cover">
                    <video id="media-preview-video" class="hidden absolute inset-0 w-full h-full object-cover" controls></video>
                </div>

                <input type="file" id="media-input" name="media_file" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime" class="hidden" required>
            </div>

            <!-- Submit Button -->
            <button type="submit"
                    class="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition font-semibold text-lg py-5 rounded-2xl mt-6">
                Upload Gallery Media
            </button>

        </form>

    </div>
</div>

<script>
    // Dynamic accept based on media type
    const mediaTypeSelect = document.getElementById('media-type-select');
    const fileInput = document.getElementById('media-input');

    mediaTypeSelect.addEventListener('change', () => {
        if (mediaTypeSelect.value === 'Image') {
            fileInput.accept = 'image/jpeg,image/png,image/webp';
        } else if (mediaTypeSelect.value === 'Video') {
            fileInput.accept = 'video/mp4,video/quicktime';
        } else {
            fileInput.accept = 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime';
        }
    });

    // Preview logic
    const dropzone = document.getElementById('media-dropzone');
    const previewImg = document.getElementById('media-preview-img');
    const previewVideo = document.getElementById('media-preview-video');
    const promptDiv = document.getElementById('media-prompt');

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) previewFile(e.target.files[0]);
    });

    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-violet-500', 'bg-zinc-900/50');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-violet-500', 'bg-zinc-900/50');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-violet-500', 'bg-zinc-900/50');
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            previewFile(file);
        }
    });

    function previewFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            promptDiv.classList.add('hidden');
            if (file.type.startsWith('image/')) {
                previewImg.src = e.target.result;
                previewImg.classList.remove('hidden');
                previewVideo.classList.add('hidden');
            } else if (file.type.startsWith('video/')) {
                previewVideo.src = e.target.result;
                previewVideo.classList.remove('hidden');
                previewImg.classList.add('hidden');
            }
        };
        reader.readAsDataURL(file);
    }
</script>

</body>
</html>