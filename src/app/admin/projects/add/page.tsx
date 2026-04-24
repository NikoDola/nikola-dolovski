"use client"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useProjectForm } from "./useProjectForm"
import { IntroducingTab } from "./introducing/IntroducingTab"
import { SectionBuilder } from "./branding/SectionBuilder"
import { UIBuilder } from "./ui/UIBuilder"
import type { ActiveTab } from "./types"
import "./add.css"

export default function AddProjectPage() {
  const params = useSearchParams()
  const router = useRouter()
  const editSlug = params.get("slug")
  const [activeTab, setActiveTab] = useState<ActiveTab>("introducing")
  const frm = useProjectForm(editSlug)

  const tabContent = (tab: ActiveTab) => ({
    display: activeTab === tab ? "flex" : "none",
    flexDirection: "column" as const,
    gap: "2rem",
  })

  return (
    <div className="apfa">
      <h1 className="apfa__title">{editSlug ? "Edit Project" : "Add Project"}</h1>

      <div className="apfa__tabs">
        {(["introducing", "branding", "ui"] as const).map((tab) => (
          <button key={tab} type="button"
            className={`apfa__tab${activeTab === tab ? " apfa__tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={frm.handleSubmit} className="apfa__form">

        <div style={tabContent("introducing")}>
          <IntroducingTab
            form={frm.form}
            editSlug={editSlug}
            set={frm.set}
            setClient={frm.setClient}
            clientThumbFile={frm.clientThumbFile}
            clientThumbPreview={frm.clientThumbPreview}
            setClientThumbFile={frm.setClientThumbFile}
            setClientThumbPreview={frm.setClientThumbPreview}
            heroFiles={frm.heroFiles}
            setHeroFiles={frm.setHeroFiles}
          />
        </div>

        <div style={tabContent("branding")}>
          <fieldset className="apfa__group">
            <legend>Branding Sections</legend>
            <SectionBuilder
              drafts={frm.sectionDrafts}
              projectSlug={frm.form.slug}
              onChange={frm.setSectionDrafts}
            />
          </fieldset>
        </div>

        <div style={tabContent("ui")}>
          <fieldset className="apfa__group">
            <legend>UI Sections</legend>
            <UIBuilder
              uiDrafts={frm.uiDrafts}
              onChange={frm.setUiDrafts}
              projectSlug={frm.form.slug}
            />
          </fieldset>
        </div>

        {frm.status && (
          <p className={`apfa__status${frm.status.ok ? "" : " apfa__status--error"}`}>{frm.status.msg}</p>
        )}
        <div className="apfa__footer">
          <button type="button" onClick={() => router.push("/admin/projects")} className="apfa__cancel">
            Cancel
          </button>
          <button type="submit" disabled={frm.saving} className="apfa__save">
            {frm.saving ? "Pushing to GitHub..." : "Save & Push"}
          </button>
        </div>

      </form>
    </div>
  )
}
