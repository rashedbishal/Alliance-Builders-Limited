<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ImageOptimizer
{
    /**
     * Compress and convert uploaded image to optimized WebP / JPEG with max dimension constraint.
     */
    public static function optimizeAndStore(UploadedFile $file, string $path, string $filename, string $disk = 'public', int $maxDim = 1920, int $quality = 80): bool
    {
        $realPath = $file->getRealPath();
        $mime = $file->getMimeType();

        if (extension_loaded('gd')) {
            $srcImage = match ($mime) {
                'image/jpeg', 'image/jpg' => @imagecreatefromjpeg($realPath),
                'image/png' => @imagecreatefrompng($realPath),
                'image/webp' => @imagecreatefromwebp($realPath),
                default => null,
            };

            if ($srcImage) {
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

                $tempPath = tempnam(sys_get_temp_dir(), 'opt_img_').'.'.pathinfo($filename, PATHINFO_EXTENSION);
                
                if (str_ends_with(strtolower($filename), '.webp')) {
                    imagewebp($srcImage, $tempPath, $quality);
                } else if (str_ends_with(strtolower($filename), '.png')) {
                    imagepng($srcImage, $tempPath, 6);
                } else {
                    imagejpeg($srcImage, $tempPath, $quality);
                }

                imagedestroy($srcImage);

                $stored = Storage::disk($disk)->putFileAs($path, new UploadedFile($tempPath, $filename), $filename);
                @unlink($tempPath);

                if ($stored) {
                    return true;
                }
            }
        }

        return $file->storeAs($path, $filename, $disk) !== false;
    }
}
