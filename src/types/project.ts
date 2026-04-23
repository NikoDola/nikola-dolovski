export interface ProjectClient {
  firstName: string
  lastName: string
}

export interface BrandColor {
  hex: string
  rgb: string
  order: number
  name?: string
  usage?: string
}

export interface Project {
  id?: string
  slug: string
  name: string
  category: "branding" | "other"
  description: string
  mission: string
  vision: string
  href: string
  client: ProjectClient
  clientThumbnail: string
  services: string[]
  review: string
  technologyUsed: string[]
  thumbnails: string[]
  heroSection: string[]
  images?: string[]
  brandColors?: BrandColor[]
  sectionDescriptions?: Record<string, string>
  deviceVideos?: {
    type?: "website" | "application"
    mobile?: string
    desktop?: string
  }
}
