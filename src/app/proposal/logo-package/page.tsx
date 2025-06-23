"use client"

import { useEffect, useState } from "react"

interface LogoImge {
  name: string
  url: string
  selected: boolean
  comment: string
}

export default function LogoPackage() {
  const [data, setData] = useState<LogoImge[]>([])

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/proposals/logoPackage")
      const resJson = await response.json()
      setData(resJson)
    }
    fetchData()
  }, [])

  async function toggleSelected(index: number) {
    const updated = [...data]
    const item = updated[index]
    const newSelected = !item.selected

    let newComment = item.comment

    if (newSelected) {
      const input = prompt("Add a comment for this image:", item.comment || "")
      if (input !== null) newComment = input
    } else {
      newComment = "" // clear comment if unselected, optional
    }

    updated[index] = {
      ...item,
      selected: newSelected,
      comment: newComment
    }

    setData(updated)

    // Send update to server
    await fetch("/api/proposals/logoPackage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        selected: newSelected,
        comment: newComment
      })
    })
  }

  return (
    <div>
      {data.length > 0 ? data.map((item, index) => (
        <div key={index} onClick={() => toggleSelected(index)} style={{ cursor: "pointer", marginBottom: "1rem" }}>
          <img src={item.url} alt={item.name} width={200} />
          <p>{item.name} - {item.selected ? "Selected" : "Not selected"}</p>
          {item.selected && item.comment && (
            <p><strong>Comment:</strong> {item.comment}</p>
          )}
        </div>
      )) : <div>We do not have data</div>}
    </div>
  )
}
