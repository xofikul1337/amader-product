"use client";

import { useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
};

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const normalizeValue = (value: string) => {
  if (!value) return "<p></p>";
  if (hasHtmlTag(value)) return value;
  return `<p>${value.replace(/\n/g, "<br />")}</p>`;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write product description...",
  minHeight = 140,
}: RichTextEditorProps) {
  const lastSelection = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeValue(value),
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    onSelectionUpdate: ({ editor: currentEditor }) => {
      const { from, to } = currentEditor.state.selection;
      lastSelection.current = { from, to };
    },
  });

  useEffect(() => {
    if (!editor) return;
    const incoming = normalizeValue(value);
    const current = editor.getHTML();
    if (incoming !== current) {
      editor.commands.setContent(incoming, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="rte">
        <div className="rte__editor" style={{ minHeight }} />
      </div>
    );
  }

  const keepSelection = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const applyTextColor = (color: string) => {
    const chain = editor.chain();
    if (lastSelection.current) {
      chain.setTextSelection(lastSelection.current);
    }
    chain.focus().setColor(color).run();
  };

  const applyBackgroundColor = (color: string) => {
    const chain = editor.chain();
    if (lastSelection.current) {
      chain.setTextSelection(lastSelection.current);
    }
    chain.focus().setHighlight({ color }).run();
  };

  const headingButton = (level: 1 | 2 | 3 | 4 | 5 | 6) => (
    <button
      type="button"
      className={editor.isActive("heading", { level }) ? "active" : ""}
      onMouseDown={keepSelection}
      onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
    >
      H{level}
    </button>
  );

  return (
    <div className="rte">
      <div className="rte__toolbar">
        <div className="rte__group">
          {headingButton(1)}
          {headingButton(2)}
          {headingButton(3)}
          {headingButton(4)}
          {headingButton(5)}
          {headingButton(6)}
        </div>
        <div className="rte__group">
          <button
            type="button"
            className={editor.isActive("bold") ? "active" : ""}
            onMouseDown={keepSelection}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={editor.isActive("underline") ? "active" : ""}
            onMouseDown={keepSelection}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span style={{ textDecoration: "underline" }}>U</span>
          </button>
        </div>
        <div className="rte__group">
          <label className="rte__color">
            Text
            <input
              type="color"
              onChange={(event) => applyTextColor(event.target.value)}
            />
          </label>
          <label className="rte__color">
            Bg
            <input
              type="color"
              onChange={(event) => applyBackgroundColor(event.target.value)}
            />
          </label>
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="rte__editor"
        style={{ minHeight }}
      />
    </div>
  );
}
