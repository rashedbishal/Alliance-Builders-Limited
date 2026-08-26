<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>404 - Page Not Found | Alliance Builders</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0a0a0a; color: #ffffff; }
        .font-serif { font-family: 'Playfair Display', serif; }
    </style>
</head>
<body class="antialiased selection:bg-cyan-500/30">
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
        <div class="pointer-events-none absolute inset-0">
            <div class="absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"></div>
            <div class="absolute right-10 bottom-10 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"></div>
        </div>

        <div class="container relative z-10 mx-auto max-w-3xl">
            <div class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-black/40 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12 md:p-16">
                <div class="absolute top-0 left-1/2 h-[2px] w-48 -translate-x-1/2 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500"></div>

                <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                    <span class="text-xs font-semibold tracking-widest text-cyan-300 uppercase">Error 404</span>
                </div>

                <h1 class="font-serif text-8xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 via-sky-400 to-blue-500 sm:text-9xl md:text-[11rem] leading-none my-4">
                    404
                </h1>

                <h2 class="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl">
                    Page Not Found
                </h2>
                <p class="mx-auto mt-4 max-w-lg text-sm text-slate-300/80 sm:text-base leading-relaxed">
                    The page or property unit you are looking for has been relocated, renamed, or no longer exists.
                </p>

                <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
                    <a href="/" class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 px-7 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:from-cyan-400 hover:to-sky-400">
                        Return Home
                    </a>
                    <a href="/contact" class="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-slate-300 shadow-lg transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:text-white">
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
