<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Finder\Finder;

class OptimizeStaticAssets extends Command
{
    protected $signature = 'assets:optimize
        {path=resources/js/assets/images : Directory to scan}
        {--max-dim=1920 : Max width/height in pixels}
        {--quality=80 : WebP quality (0-100)}
        {--min-kb=200 : Only convert files at least this large}';

    protected $description = 'Convert oversized static JPG/PNG assets to resized WebP, mirroring app/Services/ImageOptimizer.php';

    public function handle(): int
    {
        if (! extension_loaded('gd') || ! function_exists('imagewebp')) {
            $this->error('GD with WebP support is required.');
            return self::FAILURE;
        }

        $dir = base_path($this->argument('path'));
        $maxDim = (int) $this->option('max-dim');
        $quality = (int) $this->option('quality');
        $minBytes = (int) $this->option('min-kb') * 1024;

        $files = (new Finder)->files()->in($dir)->name(['*.jpg', '*.jpeg', '*.png']);

        $rows = [];

        foreach ($files as $file) {
            $originalSize = $file->getSize();
            if ($originalSize < $minBytes) {
                continue;
            }

            $srcPath = $file->getRealPath();
            $mime = mime_content_type($srcPath);

            $srcImage = match ($mime) {
                'image/jpeg' => @imagecreatefromjpeg($srcPath),
                'image/png' => @imagecreatefrompng($srcPath),
                default => null,
            };

            if (! $srcImage) {
                $this->warn("Skipped (unreadable): {$file->getRelativePathname()}");
                continue;
            }

            $width = imagesx($srcImage);
            $height = imagesy($srcImage);

            if ($width > $maxDim || $height > $maxDim) {
                if ($width >= $height) {
                    $newWidth = $maxDim;
                    $newHeight = (int) round(($height / $width) * $maxDim);
                } else {
                    $newHeight = $maxDim;
                    $newWidth = (int) round(($width / $height) * $maxDim);
                }

                $resized = imagecreatetruecolor($newWidth, $newHeight);
                imagealphablending($resized, false);
                imagesavealpha($resized, true);
                imagecopyresampled($resized, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
                imagedestroy($srcImage);
                $srcImage = $resized;
            }

            $webpPath = preg_replace('/\.(jpe?g|png)$/i', '.webp', $srcPath);
            imagewebp($srcImage, $webpPath, $quality);
            imagedestroy($srcImage);

            $newSize = filesize($webpPath);

            $rows[] = [
                $file->getRelativePathname(),
                number_format($originalSize / 1024 / 1024, 2).' MB',
                number_format($newSize / 1024 / 1024, 2).' MB',
                number_format(100 - ($newSize / $originalSize * 100), 1).'%',
            ];
        }

        if (empty($rows)) {
            $this->info('No files above the size threshold were found.');
            return self::SUCCESS;
        }

        $this->table(['File', 'Before', 'After (webp)', 'Reduction'], $rows);

        return self::SUCCESS;
    }
}
