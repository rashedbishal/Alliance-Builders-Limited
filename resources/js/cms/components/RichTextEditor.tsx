import { Color, FontSize, TextStyle } from '@tiptap/extension-text-style';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

/** Swatches chosen to stay readable on the dark public Career page. */
const COLOR_SWATCHES: { name: string; value: string }[] = [
    { name: 'White', value: '#ffffff' },
    { name: 'Light grey', value: '#cbd5e1' },
    { name: 'Grey', value: '#94a3b8' },
    { name: 'Brand blue', value: '#335fe6' },
    { name: 'Sky blue', value: '#38bdf8' },
    { name: 'Gold', value: '#c9a84c' },
    { name: 'Orange', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Purple', value: '#a78bfa' },
];

/** Font sizes in px; must stay within RichTextStyleSanitizer's 8–72px range. */
const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32];
/** Size A−/A+ step from when the text has no explicit size. */
const BASE_FONT_SIZE = 16;

const toHex = (color: string | undefined): string => {
    if (!color) return '#ffffff';
    if (color.startsWith('#')) {
        return color.length === 4
            ? '#' + [...color.slice(1)].map((c) => c + c).join('')
            : color;
    }
    const m = color.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    return m
        ? '#' +
              m
                  .slice(1, 4)
                  .map((n) => Number(n).toString(16).padStart(2, '0'))
                  .join('')
        : '#ffffff';
};

type ToolbarButton = {
    label: string;
    title: string;
    isActive: boolean;
    onClick: () => void;
    style?: React.CSSProperties;
};

/**
 * Rich text editor for CMS fields (Tiptap). The HTML it produces is
 * re-sanitized server-side by App\Services\RichTextSanitizer, so the allowed
 * formatting here must stay in sync with that whitelist.
 */
export default function RichTextEditor({
    value,
    onChange,
    placeholder,
}: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
                code: false,
                codeBlock: false,
                link: {
                    openOnClick: false,
                    autolink: true,
                    defaultProtocol: 'https',
                    protocols: ['http', 'https', 'mailto'],
                },
            }),
            TextStyle,
            Color,
            FontSize,
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'rte-content',
                ...(placeholder ? { 'data-placeholder': placeholder } : {}),
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.isEmpty ? '' : editor.getHTML());
        },
    });

    // Keep the editor in sync when the value is changed from outside
    // (e.g. the form is reset after a successful save).
    useEffect(() => {
        if (!editor) return;
        const current = editor.isEmpty ? '' : editor.getHTML();
        if (value !== current) {
            editor.commands.setContent(value || '', { emitUpdate: false });
        }
    }, [editor, value]);

    const state = useEditorState({
        editor,
        selector: ({ editor }) => {
            if (!editor) return null;
            return {
                bold: editor.isActive('bold'),
                italic: editor.isActive('italic'),
                underline: editor.isActive('underline'),
                strike: editor.isActive('strike'),
                h2: editor.isActive('heading', { level: 2 }),
                h3: editor.isActive('heading', { level: 3 }),
                h4: editor.isActive('heading', { level: 4 }),
                bulletList: editor.isActive('bulletList'),
                orderedList: editor.isActive('orderedList'),
                blockquote: editor.isActive('blockquote'),
                link: editor.isActive('link'),
                color: editor.getAttributes('textStyle').color as
                    | string
                    | undefined,
                fontSize: editor.getAttributes('textStyle').fontSize as
                    | string
                    | undefined,
            };
        },
    });

    const setLink = () => {
        if (!editor) return;
        const previous = editor.getAttributes('link').href as
            | string
            | undefined;
        const url = window.prompt(
            'Enter link URL (leave empty to remove the link):',
            previous ?? 'https://',
        );
        if (url === null) return;
        if (url.trim() === '' || url.trim() === 'https://') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .setLink({ href: url.trim() })
            .run();
    };

    // `state` only updates after the first editor transaction, so treat
    // every format as inactive until then rather than hiding the toolbar.
    type BooleanKey = Exclude<
        keyof NonNullable<typeof state>,
        'color' | 'fontSize'
    >;
    const active = (key: BooleanKey) => (state ? state[key] : false);

    const currentColor = state?.color;
    const currentSize = state?.fontSize ? parseInt(state.fontSize, 10) : null;

    // ── Colour popover ───────────────────────────────────────────
    const [colorOpen, setColorOpen] = useState(false);
    const colorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!colorOpen) return;
        const close = (e: MouseEvent) => {
            if (!colorRef.current?.contains(e.target as Node)) {
                setColorOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, [colorOpen]);

    const applyColor = (color: string | null) => {
        if (!editor) return;
        if (color) {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().unsetColor().run();
        }
    };

    // ── Font size ────────────────────────────────────────────────
    const applySize = (size: number | null) => {
        if (!editor) return;
        if (size === null) {
            editor.chain().focus().unsetFontSize().run();
        } else {
            editor.chain().focus().setFontSize(`${size}px`).run();
        }
    };

    const stepSize = (direction: 1 | -1) => {
        const from = currentSize ?? BASE_FONT_SIZE;
        const next =
            direction === 1
                ? FONT_SIZES.find((s) => s > from)
                : [...FONT_SIZES].reverse().find((s) => s < from);
        if (next !== undefined) applySize(next);
    };

    const groups: ToolbarButton[][] = editor
        ? [
              [
                  {
                      label: 'B',
                      title: 'Bold',
                      isActive: active('bold'),
                      onClick: () => editor.chain().focus().toggleBold().run(),
                      style: { fontWeight: 700 },
                  },
                  {
                      label: 'I',
                      title: 'Italic',
                      isActive: active('italic'),
                      onClick: () =>
                          editor.chain().focus().toggleItalic().run(),
                      style: { fontStyle: 'italic' },
                  },
                  {
                      label: 'U',
                      title: 'Underline',
                      isActive: active('underline'),
                      onClick: () =>
                          editor.chain().focus().toggleUnderline().run(),
                      style: { textDecoration: 'underline' },
                  },
                  {
                      label: 'S',
                      title: 'Strikethrough',
                      isActive: active('strike'),
                      onClick: () =>
                          editor.chain().focus().toggleStrike().run(),
                      style: { textDecoration: 'line-through' },
                  },
              ],
              [
                  {
                      label: 'H2',
                      title: 'Heading',
                      isActive: active('h2'),
                      onClick: () =>
                          editor
                              .chain()
                              .focus()
                              .toggleHeading({ level: 2 })
                              .run(),
                  },
                  {
                      label: 'H3',
                      title: 'Subheading',
                      isActive: active('h3'),
                      onClick: () =>
                          editor
                              .chain()
                              .focus()
                              .toggleHeading({ level: 3 })
                              .run(),
                  },
                  {
                      label: 'H4',
                      title: 'Small heading',
                      isActive: active('h4'),
                      onClick: () =>
                          editor
                              .chain()
                              .focus()
                              .toggleHeading({ level: 4 })
                              .run(),
                  },
              ],
              [
                  {
                      label: '• List',
                      title: 'Bullet list',
                      isActive: active('bulletList'),
                      onClick: () =>
                          editor.chain().focus().toggleBulletList().run(),
                  },
                  {
                      label: '1. List',
                      title: 'Numbered list',
                      isActive: active('orderedList'),
                      onClick: () =>
                          editor.chain().focus().toggleOrderedList().run(),
                  },
                  {
                      label: '❝',
                      title: 'Quote',
                      isActive: active('blockquote'),
                      onClick: () =>
                          editor.chain().focus().toggleBlockquote().run(),
                  },
              ],
              [
                  {
                      label: '🔗 Link',
                      title: 'Add / edit link',
                      isActive: active('link'),
                      onClick: setLink,
                  },
                  {
                      label: '↶',
                      title: 'Undo',
                      isActive: false,
                      onClick: () => editor.chain().focus().undo().run(),
                  },
                  {
                      label: '↷',
                      title: 'Redo',
                      isActive: false,
                      onClick: () => editor.chain().focus().redo().run(),
                  },
              ],
          ]
        : [];

    return (
        <div className="rte-wrapper">
            <style>{`
                .rte-wrapper { border: 1px solid rgba(201,168,76,0.2); border-radius: 8px; background: var(--darker); transition: border-color 0.2s, box-shadow 0.2s; }
                .rte-wrapper:focus-within { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
                .rte-toolbar { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; border-bottom: 1px solid var(--border); background: var(--surface2); border-radius: 8px 8px 0 0; }
                .rte-group { display: flex; gap: 2px; padding-right: 6px; border-right: 1px solid var(--border); }
                .rte-group:last-child { border-right: none; }
                .rte-btn { min-width: 30px; height: 28px; padding: 0 8px; background: transparent; border: 1px solid transparent; border-radius: 6px; color: var(--muted); font-size: 0.78rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s; }
                .rte-btn:hover { color: var(--text); background: rgba(201,168,76,0.08); }
                .rte-btn:disabled { opacity: 0.35; cursor: not-allowed; background: transparent; color: var(--muted); }
                .rte-btn.active { color: var(--gold); background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.35); }
                .rte-wrapper > div:last-child { position: relative; }
                .rte-color { position: relative; }
                .rte-color-btn { display: inline-flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; line-height: 1; }
                .rte-color-bar { width: 14px; height: 3px; border-radius: 2px; border: 1px solid rgba(255,255,255,0.25); }
                .rte-popover { position: absolute; top: calc(100% + 6px); left: 0; z-index: 30; width: 214px; padding: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; box-shadow: 0 12px 32px rgba(0,0,0,0.45); }
                .rte-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; }
                .rte-swatch { width: 100%; aspect-ratio: 1; border-radius: 6px; border: 2px solid rgba(255,255,255,0.12); cursor: pointer; padding: 0; transition: transform 0.12s; }
                .rte-swatch:hover { transform: scale(1.1); }
                .rte-swatch.selected { border-color: var(--gold); }
                .rte-popover-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border); }
                .rte-custom { display: inline-flex; align-items: center; gap: 6px; font-size: 0.74rem; color: var(--muted); cursor: pointer; margin: 0; }
                .rte-custom input[type="color"] { width: 26px; height: 22px; padding: 0; border: 1px solid var(--border); border-radius: 4px; background: transparent; cursor: pointer; }
                .rte-link-btn { background: none; border: none; color: var(--gold); font-size: 0.74rem; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 0; }
                .rte-size-select { width: auto !important; height: 28px; padding: 0 6px !important; font-size: 0.74rem !important; background: var(--darker) !important; border-radius: 6px !important; cursor: pointer; }
                .rte-content { min-height: 220px; max-height: 520px; overflow-y: auto; padding: 12px 14px; color: var(--text); font-size: 0.85rem; line-height: 1.65; outline: none; font-family: 'DM Sans', sans-serif; }
                .rte-content p { margin: 0 0 8px; }
                .rte-content h2, .rte-content h3, .rte-content h4 { color: inherit; margin: 14px 0 6px; font-family: 'Playfair Display', serif; }
                .rte-content h2 { font-size: 1.2rem; } .rte-content h3 { font-size: 1.05rem; } .rte-content h4 { font-size: 0.95rem; }
                .rte-content ul, .rte-content ol { padding-left: 22px; margin: 0 0 8px; }
                .rte-content ul { list-style: disc; } .rte-content ol { list-style: decimal; }
                .rte-content li p { margin: 0 0 2px; }
                .rte-content blockquote { border-left: 3px solid var(--gold); padding-left: 12px; color: var(--muted); margin: 0 0 8px; }
                .rte-content a { color: var(--gold); text-decoration: underline; }
                .rte-content hr { border: none; border-top: 1px solid var(--border); margin: 12px 0; }
                .rte-content[data-placeholder]:has(> p:only-child:empty)::before,
                .rte-content[data-placeholder]:has(> p:only-child > br.ProseMirror-trailingBreak:only-child)::before { content: attr(data-placeholder); color: var(--muted); opacity: 0.6; position: absolute; pointer-events: none; }
            `}</style>
            <div className="rte-toolbar">
                {groups.map((group, gi) => (
                    <div className="rte-group" key={gi}>
                        {group.map((btn) => (
                            <button
                                key={btn.title}
                                type="button"
                                title={btn.title}
                                className={
                                    btn.isActive ? 'rte-btn active' : 'rte-btn'
                                }
                                style={btn.style}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={btn.onClick}
                            >
                                {btn.label}
                            </button>
                        ))}
                        {gi === 0 && editor && (
                            <>
                                <div className="rte-color" ref={colorRef}>
                                    <button
                                        type="button"
                                        title="Text colour"
                                        className={
                                            currentColor
                                                ? 'rte-btn rte-color-btn active'
                                                : 'rte-btn rte-color-btn'
                                        }
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setColorOpen((o) => !o)}
                                    >
                                        <span style={{ fontWeight: 700 }}>
                                            A
                                        </span>
                                        <span
                                            className="rte-color-bar"
                                            style={{
                                                background:
                                                    currentColor ??
                                                    'transparent',
                                            }}
                                        />
                                    </button>
                                    {colorOpen && (
                                        <div className="rte-popover">
                                            <div className="rte-swatches">
                                                {COLOR_SWATCHES.map((c) => (
                                                    <button
                                                        key={c.value}
                                                        type="button"
                                                        title={c.name}
                                                        className={
                                                            currentColor &&
                                                            toHex(
                                                                currentColor,
                                                            ) === c.value
                                                                ? 'rte-swatch selected'
                                                                : 'rte-swatch'
                                                        }
                                                        style={{
                                                            background: c.value,
                                                        }}
                                                        onMouseDown={(e) =>
                                                            e.preventDefault()
                                                        }
                                                        onClick={() => {
                                                            applyColor(c.value);
                                                            setColorOpen(false);
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <div className="rte-popover-row">
                                                <label className="rte-custom">
                                                    <input
                                                        type="color"
                                                        value={toHex(
                                                            currentColor,
                                                        )}
                                                        onChange={(e) =>
                                                            applyColor(
                                                                e.target.value,
                                                            )
                                                        }
                                                    />
                                                    Custom…
                                                </label>
                                                <button
                                                    type="button"
                                                    className="rte-link-btn"
                                                    onMouseDown={(e) =>
                                                        e.preventDefault()
                                                    }
                                                    onClick={() => {
                                                        applyColor(null);
                                                        setColorOpen(false);
                                                    }}
                                                >
                                                    Reset colour
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ))}
                {editor && (
                    <div className="rte-group">
                        <button
                            type="button"
                            title="Decrease font size"
                            className="rte-btn"
                            disabled={
                                (currentSize ?? BASE_FONT_SIZE) <= FONT_SIZES[0]
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => stepSize(-1)}
                        >
                            A−
                        </button>
                        <select
                            title="Font size"
                            className="rte-size-select"
                            value={currentSize ?? ''}
                            onChange={(e) =>
                                applySize(
                                    e.target.value === ''
                                        ? null
                                        : Number(e.target.value),
                                )
                            }
                        >
                            <option value="">Default</option>
                            {FONT_SIZES.map((s) => (
                                <option key={s} value={s}>
                                    {s}px
                                </option>
                            ))}
                            {currentSize !== null &&
                                !FONT_SIZES.includes(currentSize) && (
                                    <option value={currentSize}>
                                        {currentSize}px
                                    </option>
                                )}
                        </select>
                        <button
                            type="button"
                            title="Increase font size"
                            className="rte-btn"
                            style={{ fontSize: '0.9rem' }}
                            disabled={
                                (currentSize ?? BASE_FONT_SIZE) >=
                                FONT_SIZES[FONT_SIZES.length - 1]
                            }
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => stepSize(1)}
                        >
                            A+
                        </button>
                    </div>
                )}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
