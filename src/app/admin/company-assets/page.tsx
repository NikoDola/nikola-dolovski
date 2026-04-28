"use client"
import Link from "next/link"
import AdminNav from "../AdminNav"

export default function CompanyAssetsPage() {
  return (
    <div className="admin-page">
      <AdminNav backHref="/admin" backLabel="Dashboard" sectionLabel="Company Assets" />
      <div className="admin-inner">
        <div className="admin-header">
          <div className="admin-badge">
            <div className="admin-badge-dot" />
            <span className="admin-badge-label">Studio</span>
          </div>
          <h1 className="admin-title">Company Assets</h1>
          <p className="admin-subtitle">Manage the logo inspiration library, fonts, and color palettes that power the branding calculator.</p>
        </div>

        <div className="admin-cards">
          <Link href="/admin/company-assets/logos" className="admin-section-card">
            <div className="admin-section-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="var(--color-accent)" strokeWidth="1.6"/>
                <circle cx="9" cy="11" r="2.5" stroke="var(--color-accent)" strokeWidth="1.4"/>
                <path d="M3 17l4-4 3 3 4-5 7 6" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="admin-section-card__title">Logo Library</div>
            <div className="admin-section-card__desc">Upload your portfolio logos used as style references in the branding calculator. Tag each logo for accurate filtering.</div>
            <div className="admin-section-card__arrow">
              Manage logos
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>

          <Link href="/admin/company-assets/fonts" className="admin-section-card">
            <div className="admin-section-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 20V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round"/>
                <path d="M8 20h8M12 8v8" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M9 10h6" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="admin-section-card__title">Font Library</div>
            <div className="admin-section-card__desc">Add Google Fonts to the typography browser shown in the branding calculator. Clients use these as font inspiration references.</div>
            <div className="admin-section-card__arrow">
              Manage fonts
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
