export type ServiceType = "design" | "redesign" | null
export type Screen =
  | "service" | "brand-info" | "upload"
  | "style-red" | "variations" | "style-icon"
  | "typography" | "colors" | "summary"

export interface Order {
  serviceType:    ServiceType
  variations:     string[]
  companyName?:   string
  tagline?:       string
  description?:   string
  styles?:        string[]
  pinterestUrl?:  string
  typographyType?:  "custom" | "free" | null
  customPrice?:     number
  selectedFonts?:   string[]
  fontLinks?:       string[]
  sameBrandFont?:   boolean
  colorFamilies?:   string[]
  customColors?:    string[]
  useSameColors?:   boolean
}

export interface FontDef {
  id:       string
  name:     string
  family:   string
  weight:   number
  sample:   string
  sublabel?: string
}

export interface BrandService {
  id:           string
  label:        string
  perVariation: boolean
  tooltip:      string
}
