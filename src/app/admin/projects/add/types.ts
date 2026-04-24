import type { BrandColor } from "@/types/project"

export interface SectionFile { file: File; name: string; preview: string }

export interface SectionDraft {
  id: string
  path: string[]
  headline: string
  body: string
  sectionColors: BrandColor[]
  newFiles: SectionFile[]
  existingImages: string[]
}

export interface UiSectionDraft {
  id: string
  type: string
  headline: string
  newFiles: SectionFile[]
  existingImages: string[]
  mobileUrl: string
  desktopUrl: string
  deviceType: "website" | "application"
}

export type BuildMode = "navigate" | "form"

export interface BuildState {
  editId: string | null
  path: string[]
  headline: string
  body: string
  sectionColors: BrandColor[]
  colorPickerHex: string
  newFiles: SectionFile[]
  existingImages: string[]
  mode: BuildMode
}

export interface UiBuildState {
  editId: string | null
  type: string
  headline: string
  newFiles: SectionFile[]
  existingImages: string[]
  mobileUrl: string
  desktopUrl: string
  deviceType: "website" | "application"
}

export type ActiveTab = "introducing" | "branding" | "ui"
