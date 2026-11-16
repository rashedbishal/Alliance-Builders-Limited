<?php

namespace App\Services;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

/**
 * Whitelists the HTML produced by the CMS rich-text editor (Tiptap) before
 * it is stored and later rendered on the public site.
 */
class RichTextSanitizer
{
    private const ALLOWED_ELEMENTS = [
        'p' => [], 'br' => [], 'hr' => [],
        'h2' => [], 'h3' => [], 'h4' => [],
        'strong' => [], 'b' => [], 'em' => [], 'i' => [], 'u' => [], 's' => [],
        'ul' => [], 'ol' => [], 'li' => [],
        'blockquote' => [],
        'a' => ['href'],
        // Only color / font-size survive, see RichTextStyleSanitizer.
        'span' => ['style'],
    ];

    public static function clean(?string $html): string
    {
        if ($html === null || trim($html) === '') {
            return '';
        }

        $config = (new HtmlSanitizerConfig)
            ->allowLinkSchemes(['https', 'http', 'mailto'])
            ->forceAttribute('a', 'rel', 'noopener noreferrer nofollow')
            ->forceAttribute('a', 'target', '_blank')
            ->withAttributeSanitizer(new RichTextStyleSanitizer)
            ->withMaxInputLength(100_000);

        foreach (self::ALLOWED_ELEMENTS as $element => $attributes) {
            $config = $config->allowElement($element, $attributes);
        }

        return (new HtmlSanitizer($config))->sanitize($html);
    }

    /**
     * True when the HTML contains no visible text (e.g. "<p></p>").
     */
    public static function isBlank(?string $html): bool
    {
        return trim(html_entity_decode(strip_tags((string) $html), ENT_QUOTES | ENT_HTML5), " \t\n\r\0\x0B\u{00A0}") === '';
    }
}
