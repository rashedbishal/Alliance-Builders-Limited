<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Media Content</title>
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

        <h1 class="text-4xl font-bold tracking-tight mb-2">Upload Media Content</h1>
        <p class="text-zinc-400 mb-10">Add news, video, article or featured media item</p>

        <form method="POST" action="{{ route('add-media') }}" enctype="multipart/form-data" class="space-y-10">

            @csrf

            <!-- Media Title -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Media Title <span class="text-red-500">*</span>
                </label>
                <input type="text" name="media_title" required
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition"
                       placeholder="New Luxury Project Launched in Dubai Marina">
            </div>

            <!-- Media Type -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Media Type <span class="text-red-500">*</span>
                </label>
                <select name="media_type" required
                        class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition">
                    <option value="" disabled selected>Select type</option>
                    <option value="news">News / Article</option>
                    <option value="video">Video (YouTube / Embed)</option>
                    <option value="press_release">Press Release</option>
                    <option value="event">Event Announcement</option>
                    <option value="award">Award / Recognition</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <!-- News / Hyperlink -->
            <div>
                <label class="block text-sm font-medium text-zinc-400 mb-2">
                    Link / Hyperlink <span class="text-red-500">*</span>
                </label>
                <input type="url" name="news_hyperlink" required
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-4 focus:border-violet-500 focus:outline-none transition"
                       placeholder="https://example.com/news/luxury-project-launch"
                       title="Full URL to the article, YouTube video, press release, etc.">
            </div>

            <!-- Featured Toggle -->
            <div class="flex items-center gap-3">
                <input type="checkbox" name="isFeatured" id="is-featured" value="1"
                       class="w-5 h-5 accent-violet-600 bg-zinc-800 border-zinc-700 rounded">
                <label for="is-featured" class="cursor-pointer text-zinc-300">
                    Mark as Featured Media (show on homepage / highlight)
                </label>
            </div>

            <!-- Image Upload -->
            <div class="border-t border-zinc-700 pt-8">
                <label class="block text-sm font-medium text-zinc-400 mb-3">
                    Media Cover Image <span class="text-red-500">*</span>
                </label>

                <div id="media-dropzone"
                     class="dropzone relative aspect-video bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">

                    <div id="media-prompt" class="text-center px-8">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 mx-auto text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                        </svg>
                        <p class="mt-4 text-white font-medium">Drop cover image here or click to select</p>
                        <p class="mt-1 text-sm text-zinc-500">Recommended: 1200×675 px (16:9)</p>
                    </div>

                    <img id="media-preview" class="hidden absolute inset-0 w-full h-full object-cover">
                </div>

                <input type="file" id="media-input" name="cover_image" accept="image/jpeg,image/png,image/webp" class="hidden" required>
            </div>

            <!-- Submit Button -->
            <button type="submit"
                    class="w-full bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition font-semibold text-lg py-5 rounded-2xl mt-6">
                Upload Media Item
            </button>

        </form>

    </div>
</div>

<script>
    // Simple image preview + drag & drop
    const dropzone = document.getElementById('media-dropzone');
    const fileInput = document.getElementById('media-input');
    const previewImg = document.getElementById('media-preview');
    const promptDiv  = document.getElementById('media-prompt');

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
        if (e.dataTransfer.files[0] && e.dataTransfer.files[0].type.startsWith('image/')) {
            fileInput.files = e.dataTransfer.files;
            previewFile(e.dataTransfer.files[0]);
        }
    });

    function previewFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            previewImg.classList.remove('hidden');
            promptDiv.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
</script>

</body>
</html>
