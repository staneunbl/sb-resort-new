// src/Tiptap.jsx
import {
  useEditor,
  EditorContent,
  FloatingMenu,
  BubbleMenu,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TipTapToolbar from "./TipTapToolbar";
import Heading from "@tiptap/extension-heading";
import OList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

const Tiptap = ({ value, onChange }: any) => {
  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({}),
        Heading.configure({
          HTMLAttributes: {
            class: "text-2xl font-bold h-min",
            levels: [2],
          },
        }),
        ListItem.configure({
          HTMLAttributes: {
            class: "list-disc before:content-['•'] flex gap-2 pl-2",
          },
        }),
      ],

      content: value,
      editorProps: {
        attributes: {
          class:
            "rounded-md border h-52 border-input bg-white p-2 overflow-auto before:content-w-min w-100",
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
        console.log(editor.getHTML());
      },
    },
    [value],
  );

  return (
    <div className="flex flex-col gap-2">
      <TipTapToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
