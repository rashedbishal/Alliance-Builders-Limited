<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;
use Symfony\Component\HtmlSanitizer\Visitor\AttributeSanitizer\AttributeSanitizerInterface;

/**
 * Filters the inline `style` attribute on <span> so that only the text
 * colour and font size produced by the CMS editor survive, with strictly
 * validated values. Every other CSS declaration is dropped.
 */
class RichTextStyleSanitizer implements AttributeSanitizerInterface
{
    public const MIN_FONT_SIZE = 8;

    public const MAX_FONT_SIZE = 72;

    public function getSupportedElements(): ?array
    {
        return ['span'];
    }

    public function getSupportedAttributes(): ?array
    {
        return ['style'];
    }

    public function sanitizeAttribute(string $element, string $attribute, string $value, HtmlSanitizerConfig $config): ?string
    {
        $kept = [];

        foreach (explode(';', $value) as $declaration) {
            if (! str_contains($declaration, ':')) {
                continue;
            }

            [$property, $propertyValue] = array_map('trim', explode(':', $declaration, 2));
            $property = strtolower($property);

            if ($property === 'color' && self::isValidColor($propertyValue)) {
                $kept['color'] = 'color: '.strtolower($propertyValue);
            } elseif ($property === 'font-size' && ($size = self::validFontSize($propertyValue)) !== null) {
                $kept['font-size'] = 'font-size: '.$size;
            }
        }

        return $kept === [] ? null : implode('; ', $kept);
    }

    private static function isValidColor(string $value): bool
    {
        return (bool) preg_match('/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i', $value)
            || (bool) preg_match('/^rgb\(\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*\)$/i', $value);
    }

    private static function validFontSize(string $value): ?string
    {
        if (! preg_match('/^(\d{1,2})px$/i', $value, $m)) {
            return null;
        }

        $size = (int) $m[1];

        return $size >= self::MIN_FONT_SIZE && $size <= self::MAX_FONT_SIZE ? $size.'px' : null;
    }
}
