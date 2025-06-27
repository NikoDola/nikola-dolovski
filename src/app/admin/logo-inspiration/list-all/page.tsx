"use client"
import { listlogos } from "@/lib/actions/inspirationList"
import { useEffect, useState } from "react"

interface LogoItem {
  id: string  
  imageUrl: string

}

export default function ListAllInspiration() {
  const [logos, setLogos] = useState<LogoItem[]>([]) // Better to initialize as empty array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogos() {
      try {
        setLoading(true)
        const logosData = await listlogos()
        
        // Type assertion to ensure correct data shape
        const typedLogos = logosData as LogoItem[]
        setLogos(typedLogos)
      } catch (err) {
        console.error("Failed to fetch logos:", err)
        setError(err instanceof Error ? err.message : "Failed to load logos")
      } finally {
        setLoading(false)
      }
    }

    fetchLogos()
  }, [])

  if (loading) return <div className="p-4">Loading logos...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!logos.length) return <div className="p-4">No logos found</div>

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {logos.map((item) => (
        <div key={item.id} className="border rounded overflow-hidden">
          <img 
            src={item.imageUrl} 
            alt="Logo inspiration"
            className="w-full h-48 object-contain bg-gray-100"
            onError={(e) => {
              // Fallback if image fails to load
              (e.currentTarget as HTMLImageElement).src = '/placeholder.jpg'
            }}
          />
    
        </div>
      ))}
    </div>
  )
}