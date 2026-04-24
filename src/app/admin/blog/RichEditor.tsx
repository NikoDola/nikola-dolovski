"use client"
import { useEffect, useRef } from "react"
import "./blog.css"

interface Props {
  value: string
  onChange: (html: string) => void
}

export function RichEditor({ value, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  function exec(cmd: string, arg?: string) {
    document.execCommand(cmd, false, arg)
    editorRef.current?.focus()
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  function handleInput() {
    if (editorRef.current) onChange(editorRef.current.innerHTML)
  }

  return (
    <div className="rte">
      <div className="rte__toolbar">
        <button type="button" className="rte__btn" title="Bold" onClick={() => exec("bold")}><strong>B</strong></button>
        <button type="button" className="rte__btn" title="Italic" onClick={() => exec("italic")}><em>I</em></button>
        <button type="button" className="rte__btn" title="Underline" onClick={() => exec("underline")}><u>U</u></button>
        <span className="rte__sep" />
        <button type="button" className="rte__btn" title="H2" onClick={() => exec("formatBlock", "h2")}>H2</button>
        <button type="button" className="rte__btn" title="H3" onClick={() => exec("formatBlock", "h3")}>H3</button>
        <button type="button" className="rte__btn" title="Paragraph" onClick={() => exec("formatBlock", "p")}>P</button>
        <span className="rte__sep" />
        <button type="button" className="rte__btn" title="Bullet list" onClick={() => exec("insertUnorderedList")}>• List</button>
        <button type="button" className="rte__btn" title="Numbered list" onClick={() => exec("insertOrderedList")}>1. List</button>
        <span className="rte__sep" />
        <button type="button" className="rte__btn" title="Clear formatting" onClick={() => exec("removeFormat")}>Clear</button>
      </div>
      <div
        ref={editorRef}
        className="rte__body"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
      />
    </div>
  )
}
