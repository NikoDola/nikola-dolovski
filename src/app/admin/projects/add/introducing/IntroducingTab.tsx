"use client"
import { useRef } from "react"
import { TagsInput } from "@/components/ui/TagsInput"
import type { Project } from "@/types/project"
import type { SectionFile } from "../types"
import { slugify, getInitials } from "../useProjectForm"

interface Props {
  form: Project
  editSlug: string | null
  set: (field: keyof Project, value: unknown) => void
  setClient: (field: keyof Project["client"], value: string) => void
  clientThumbFile: File | null
  clientThumbPreview: string
  setClientThumbFile: (f: File | null) => void
  setClientThumbPreview: (url: string) => void
  heroFiles: SectionFile[]
  setHeroFiles: (files: SectionFile[]) => void
}

export function IntroducingTab({
  form, editSlug, set, setClient,
  clientThumbFile, clientThumbPreview, setClientThumbFile, setClientThumbPreview,
  heroFiles, setHeroFiles,
}: Props) {
  const clientThumbRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)
  const initials = getInitials(form.client.firstName, form.client.lastName)

  return (
    <>
      <fieldset className="apfa__group">
        <legend>Project Info</legend>
        <label>Project Name
          <input value={form.name} onChange={(e) => {
            set("name", e.target.value)
            if (!editSlug) set("slug", slugify(e.target.value))
          }} required />
        </label>
        <label>Slug
          <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
        </label>
        <label>Category
          <select value={form.category} onChange={(e) => set("category", e.target.value as "branding" | "other")}>
            <option value="branding">Branding</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label>Description <span className="apfa__hint">(60–500 chars)</span>
          <textarea value={form.description} minLength={60} maxLength={500} rows={4}
            onChange={(e) => set("description", e.target.value)} required />
        </label>
        <label>Page Link <span className="apfa__hint">(leave blank for /my-work/{"{slug}"})</span>
          <input value={form.href} placeholder={`/my-work/${form.slug || "slug"}`}
            onChange={(e) => set("href", e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Mission & Vision</legend>
        <label>Mission <span className="apfa__hint">(what the brand does and for whom)</span>
          <textarea value={form.mission} rows={3} onChange={(e) => set("mission", e.target.value)}
            placeholder="We help X achieve Y through Z..." />
        </label>
        <label>Vision <span className="apfa__hint">(where the brand is going)</span>
          <textarea value={form.vision} rows={3} onChange={(e) => set("vision", e.target.value)}
            placeholder="To become the leading..." />
        </label>
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Client</legend>
        <div className="apfa__clientThumb">
          <div className="apfa__clientAvatar"
            style={{ backgroundImage: clientThumbPreview ? `url(${clientThumbPreview})` : "none" }}>
            {!clientThumbPreview && <span>{initials}</span>}
          </div>
          <div className="apfa__clientAvatarMeta">
            <p>Client logo or photo <span className="apfa__hint">(optional)</span></p>
            <button type="button" onClick={() => clientThumbRef.current?.click()} className="apfa__addImg">
              {clientThumbFile ? "Change Image" : "Upload Image"}
            </button>
            <input ref={clientThumbRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                setClientThumbFile(file)
                setClientThumbPreview(URL.createObjectURL(file))
              }} />
          </div>
        </div>
        <label>First Name
          <input value={form.client.firstName} onChange={(e) => setClient("firstName", e.target.value)} required />
        </label>
        <label>Last Name
          <input value={form.client.lastName} onChange={(e) => setClient("lastName", e.target.value)} required />
        </label>
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Services</legend>
        <TagsInput tags={form.services}
          onAddTag={(t) => set("services", [...form.services, t])}
          onRemoveTag={(t) => set("services", form.services.filter((s) => s !== t))} />
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Technology Used</legend>
        <TagsInput tags={form.technologyUsed}
          onAddTag={(t) => set("technologyUsed", [...form.technologyUsed, t])}
          onRemoveTag={(t) => set("technologyUsed", form.technologyUsed.filter((s) => s !== t))} />
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Client Review</legend>
        <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={4}
          placeholder="Client testimonial..." />
      </fieldset>

      <fieldset className="apfa__group">
        <legend>Hero / Thumbnail <span className="apfa__hint">— shown in portfolio grid and page hero</span></legend>
        {heroFiles.length > 0 && (
          <div className="apfa__assetGrid">
            {heroFiles.map((f, i) => (
              <div key={i} className="apfa__assetCard apfa__assetCard--valid">
                <button type="button" className="apfa__assetRemove"
                  onClick={() => setHeroFiles(heroFiles.filter((_, j) => j !== i))}>✕</button>
                <div className="apfa__assetPreview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.preview} alt={f.name} />
                </div>
                <div className="apfa__assetInfo">
                  <span className="apfa__assetNameInput apfa__assetNameInput--readonly">{f.name}</span>
                  <span className="apfa__assetOk">Ready</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {form.thumbnails && form.thumbnails.length > 0 && heroFiles.length === 0 && (
          <div className="apfa__existingSection">
            <p className="apfa__existingLabel">Current thumbnail</p>
            <div className="apfa__assetGrid">
              {form.thumbnails.map((path) => (
                <div key={path} className="apfa__assetCard apfa__assetCard--valid apfa__assetCard--existing">
                  <div className="apfa__assetPreview">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={path} alt="" />
                  </div>
                  <div className="apfa__assetInfo">
                    <span className="apfa__assetNameInput apfa__assetNameInput--readonly">{path.split("/").pop()}</span>
                    <span className="apfa__assetOk">Saved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <input ref={heroInputRef} type="file" accept="image/*,.svg,.avif,.webp" multiple
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []).map((f) => ({
              file: f, name: f.name, preview: URL.createObjectURL(f),
            }))
            setHeroFiles([...heroFiles, ...files])
            if (heroInputRef.current) heroInputRef.current.value = ""
          }} />
        <button type="button" onClick={() => heroInputRef.current?.click()} className="apfa__addImg">
          + Upload Hero Image
        </button>
      </fieldset>
    </>
  )
}
