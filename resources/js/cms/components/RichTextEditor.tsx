import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';

interface Props {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
}

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
    const active = (key: keyof NonNullable<typeof state>) =>
        state ? state[key] : false;

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
                .rte-btn.active { color: var(--gold); background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.35); }
                .rte-wrapper > div:last-child { position: relative; }
                .rte-content { min-height: 220px; max-height: 520px; overflow-y: auto; padding: 12px 14px; color: var(--text); font-size: 0.85rem; line-height: 1.65; outline: none; font-family: 'DM Sans', sans-serif; }
                .rte-content p { margin: 0 0 8px; }
                .rte-content h2, .rte-content h3, .rte-content h4 { color: var(--gold-light); margin: 14px 0 6px; font-family: 'Playfair Display', serif; }
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
                    </div>
                ))}
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
