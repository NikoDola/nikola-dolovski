import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getProjects } from "@/lib/actions/projects"
import type { Project, ProjectSection } from "@/types/project"
import type { SectionDraft, SectionFile, UiSectionDraft } from "./types"
import { isColorSection } from "./tree"

export function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

export function getInitials(firstName: string, lastName: string) {
  return ((firstName.trim()[0] ?? "") + (lastName.trim()[0] ?? "")).toUpperCase() || "?"
}

const empty: Project = {
  slug: "", name: "", category: "branding", description: "",
  mission: "", vision: "", href: "", clientThumbnail: "",
  client: { firstName: "", lastName: "" },
  services: [], review: "", technologyUsed: [],
  thumbnails: [], heroSection: [], images: [], brandColors: [], sections: [],
}

export function useProjectForm(editSlug: string | null) {
  const router = useRouter()
  const [form, setForm] = useState<Project>(empty)
  const [sectionDrafts, setSectionDrafts] = useState<SectionDraft[]>([])
  const [uiDrafts, setUiDrafts] = useState<UiSectionDraft[]>([])
  const [clientThumbFile, setClientThumbFile] = useState<File | null>(null)
  const [clientThumbPreview, setClientThumbPreview] = useState<string>("")
  const [heroFiles, setHeroFiles] = useState<SectionFile[]>([])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)

  useEffect(() => {
    if (!editSlug) return
    getProjects().then((projects) => {
      const p = projects.find((pr) => pr.slug === editSlug)
      if (!p) return
      setForm(p)
      if (p.sections) {
        const brandDrafts = p.sections
          .filter((s) => s.path[0] === "Branding")
          .map((s) => ({
            id: s.id, path: s.path, headline: s.headline, body: s.body ?? "",
            sectionColors: s.colors ?? [],
            newFiles: [], existingImages: s.images,
          }))
        setSectionDrafts(brandDrafts)

        const uiLoaded = p.sections
          .filter((s) => s.path[0] === "UI")
          .map((s) => ({
            id: s.id, type: s.path[1]?.toLowerCase() ?? "website",
            headline: s.headline, newFiles: [], existingImages: s.images,
            mobileUrl: p.deviceVideos?.mobile ?? "",
            desktopUrl: p.deviceVideos?.desktop ?? "",
            deviceType: (p.deviceVideos?.type ?? "website") as "website" | "application",
          }))
        if (uiLoaded.length > 0) {
          setUiDrafts(uiLoaded)
        } else if (p.deviceVideos) {
          setUiDrafts([{
            id: crypto.randomUUID(),
            type: p.deviceVideos.type ?? "website",
            headline: p.deviceVideos.type === "application" ? "Application" : "Website",
            newFiles: [], existingImages: [],
            mobileUrl: p.deviceVideos.mobile ?? "",
            desktopUrl: p.deviceVideos.desktop ?? "",
            deviceType: (p.deviceVideos.type ?? "website") as "website" | "application",
          }])
        }
      } else if (p.deviceVideos) {
        setUiDrafts([{
          id: crypto.randomUUID(),
          type: p.deviceVideos.type ?? "website",
          headline: p.deviceVideos.type === "application" ? "Application" : "Website",
          newFiles: [], existingImages: [],
          mobileUrl: p.deviceVideos.mobile ?? "",
          desktopUrl: p.deviceVideos.desktop ?? "",
          deviceType: (p.deviceVideos.type ?? "website") as "website" | "application",
        }])
      }
    })
  }, [editSlug])

  const set = (field: keyof Project, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const setClient = (field: keyof Project["client"], value: string) =>
    setForm((f) => ({ ...f, client: { ...f.client, [field]: value } }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const slug = form.slug

      const brandSections: ProjectSection[] = sectionDrafts.map((sd) => ({
        id: sd.id,
        path: sd.path,
        headline: sd.headline || sd.path[sd.path.length - 1] || "Untitled",
        ...(sd.body && { body: sd.body }),
        images: [...sd.existingImages, ...sd.newFiles.map((f) => `/my-work/${slug}/images/${f.name}`)],
        ...(sd.sectionColors.length > 0 && { colors: sd.sectionColors }),
      }))

      const uiSections: ProjectSection[] = uiDrafts.map((ud) => ({
        id: ud.id,
        path: ["UI", ud.type.charAt(0).toUpperCase() + ud.type.slice(1)],
        headline: ud.headline || ud.type,
        images: [...ud.existingImages, ...ud.newFiles.map((f) => `/my-work/${slug}/images/${f.name}`)],
      }))

      const colorSectionColors = sectionDrafts
        .filter((d) => isColorSection(d.path))
        .flatMap((d) => d.sectionColors)

      const websiteUi = uiDrafts.find((d) => d.type === "website" || d.type === "application")
      const deviceVideos = websiteUi
        ? { type: websiteUi.deviceType, mobile: websiteUi.mobileUrl || undefined, desktop: websiteUi.desktopUrl || undefined }
        : form.deviceVideos

      const heroImagePaths = heroFiles.map((f) => `/my-work/${slug}/images/${f.name}`)
      const allSectionImages = brandSections.flatMap((s) => s.images)
      const firstHero = heroImagePaths[0] ?? form.thumbnails?.[0] ?? allSectionImages[0] ?? ""

      const clientThumbPath = clientThumbFile
        ? `/my-work/${slug}/images/client-thumbnail.${clientThumbFile.name.split(".").pop()}`
        : form.clientThumbnail

      const project: Project = {
        ...form,
        href: form.href || `/my-work/${slug}`,
        clientThumbnail: clientThumbPath,
        brandColors: colorSectionColors.length > 0 ? colorSectionColors : form.brandColors,
        sections: [...brandSections, ...uiSections],
        deviceVideos,
        thumbnails: heroImagePaths.length > 0 ? heroImagePaths : form.thumbnails,
        heroSection: heroImagePaths.length > 0 ? heroImagePaths : form.heroSection,
        images: [firstHero, ...allSectionImages].filter(Boolean),
      }

      const fd = new FormData()
      fd.append("project", JSON.stringify(project))
      for (const sd of sectionDrafts)
        for (const f of sd.newFiles)
          fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      for (const ud of uiDrafts)
        for (const f of ud.newFiles)
          fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      for (const f of heroFiles)
        fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      if (clientThumbFile) fd.append("clientThumbnail", clientThumbFile)

      const res = await fetch("/api/push-project", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Push failed")

      setStatus({ msg: `Pushed to GitHub! Slug: ${slug}`, ok: true })
      setTimeout(() => router.push("/admin/projects"), 1800)
    } catch (err) {
      setStatus({ msg: err instanceof Error ? err.message : "Error", ok: false })
    } finally {
      setSaving(false)
    }
  }

  return {
    form, set, setClient,
    sectionDrafts, setSectionDrafts,
    uiDrafts, setUiDrafts,
    clientThumbFile, setClientThumbFile,
    clientThumbPreview, setClientThumbPreview,
    heroFiles, setHeroFiles,
    saving, status,
    handleSubmit,
  }
}
