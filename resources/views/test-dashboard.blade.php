<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carousel Uploader • 5 Positions</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body { font-family: 'Inter', system_ui, sans-serif; }

        .dropzone {
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .dropzone:hover {
            border-color: rgb(139 92 246);
        }
        .preview-img {
            transition: opacity 0.3s ease;
        }
    </style>
</head>
<body class="bg-zinc-950 text-zinc-200 min-h-screen pb-24">
<div class="max-w-7xl mx-auto px-6 py-12">
    <!-- Header -->
    <div class="max-w-2xl mx-auto text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-2 text-sm font-medium">
            <div class="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
            CAROUSEL MANAGER
        </div>
        <h1 class="text-6xl font-bold tracking-tighter mt-6 bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
            Upload Carousel Images
        </h1>
        <p class="text-zinc-400 mt-4 text-lg">
            5 individual forms — one image per carousel position.<br>
            Drag &amp; drop or click to upload. Live preview included.
        </p>
    </div>

    <!-- Forms Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        @for ($i = 1; $i <= 5; $i++)
            <div class="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                <div class="p-8">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-3">
                            <span class="text-4xl font-bold text-violet-500">{{ str_pad($i, 2, '0', STR_PAD_LEFT) }}</span>
                            <div>
                                <div class="text-xs uppercase tracking-widest text-zinc-500">Position</div>
                                <div class="text-2xl font-semibold text-white">Slide {{ $i }}</div>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-xs text-emerald-400 font-medium">1920×1080 recommended</div>
                        </div>
                    </div>

                    <form method="POST"
                          action="{{ route('update-carousel') }}"
                          id="form-{{ $i }}"
                          enctype="multipart/form-data"
                          class="space-y-6">

                        @csrf
                        <input type="hidden" name="position" value="{{ $i }}">

                        <div id="dropzone-{{ $i }}"
                             class="dropzone relative aspect-video bg-zinc-950 border-2 border-dashed border-zinc-700 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">

                            <!-- Upload Prompt -->
                            <div id="prompt-{{ $i }}" class="flex flex-col items-center justify-center text-center px-8">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.4" stroke="currentColor" class="w-20 h-20 text-zinc-600">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                </svg>
                                <p class="mt-6 text-lg font-medium text-white">Drop image here</p>
                                <p class="text-sm text-zinc-400 mt-1">or click to select</p>
                                <p class="text-[10px] text-zinc-500 mt-8">JPG • PNG • WEBP • Max 10MB</p>
                            </div>

                            <!-- Live Preview -->
                            <img id="preview-img-{{ $i }}"
                                 class="preview-img hidden absolute inset-0 w-full h-full object-cover"
                                 alt="Slide {{ $i }} preview">
                        </div>

                        <input id="file-{{ $i }}"
                               type="file"
                               name="image"
                               accept="image/jpeg,image/jpg"
                               class="hidden" required>

                        <button type="submit"
                                class="w-full py-5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all font-semibold text-lg rounded-2xl flex items-center justify-center gap-2">
                            <span>Upload for Position {{ $i }}</span>
                        </button>
                    </form>
                </div>
            </div>
        @endfor

    </div>

    <div class="mt-16 text-center text-xs text-zinc-500">
        Each form submits independently to your Laravel route
    </div>
</div>

<script>
    function setupUpload(n) {
        const dropzone   = document.getElementById(`dropzone-${n}`);
        const fileInput  = document.getElementById(`file-${n}`);
        const prompt     = document.getElementById(`prompt-${n}`);
        const previewImg = document.getElementById(`preview-img-${n}`);

        // Click to open file dialog
        dropzone.addEventListener('click', () => fileInput.click());

        // File selected (click or drop)
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) handleFile(file, n);
        });

        // Drag & Drop support
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('border-violet-500', 'bg-zinc-900');
        });

        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('border-violet-500', 'bg-zinc-900');
        });

        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('border-violet-500', 'bg-zinc-900');

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                // Assign dropped file to the hidden input so Laravel receives it
                const dt = new DataTransfer();
                dt.items.add(file);
                fileInput.files = dt.files;

                handleFile(file, n);
            }
        });
    }

    function handleFile(file, n) {
        const reader = new FileReader();
        const prompt = document.getElementById(`prompt-${n}`);
        const previewImg = document.getElementById(`preview-img-${n}`);

        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.classList.remove('hidden');
            prompt.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }

    // Initialize all 5 forms
    window.onload = () => {
        for (let i = 1; i <= 5; i++) {
            setupUpload(i);
        }
    };
</script>
</body>
</html>