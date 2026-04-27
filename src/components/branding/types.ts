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
  estYear?:       string
  description?:   string
  file?:          File | null
  styles?:        string[]
  inspirationFile?: File | null
  typographyType?:  "custom" | "free" | null
  customPrice?:     number
  selectedFonts?:   string[]
  uploadedFont?:    File | null
  fontName?:        string
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
