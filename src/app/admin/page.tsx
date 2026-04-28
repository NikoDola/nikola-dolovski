"use client"
import Link from "next/link"
import AdminNav from "./AdminNav"

export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <AdminNav sectionLabel="Dashboard" />
      <div className="admin-inner">
        <div className="admin-header">
          <div className="admin-badge">
            <div className="admin-badge-dot" />
            <span className="admin-badge-label">Admin</span>
          </div>
          <h1 className="admin-title">Welcome back, Nikola</h1>
          <p className="admin-subtitle">Manage your orders, review client requests, and keep your studio organized.</p>
        </div>

        <div className="admin-cards">
          <Link href="/admin/orders" className="admin-section-card">
            <div className="admin-section-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="var(--color-accent)" strokeWidth="1.6"/>
                <path d="M7 8h10M7 12h7M7 16h5" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="admin-section-card__title">Client Orders</div>
            <div className="admin-section-card__desc">Review all incoming logo orders, see full client briefs, download files, and track project status.</div>
            <div className="admin-section-card__arrow">
              View orders
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>

          <Link href="/admin/company-assets" className="admin-section-card">
            <div className="admin-section-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="14" rx="3" stroke="var(--color-accent)" strokeWidth="1.6"/>
                <circle cx="9" cy="11" r="2.5" stroke="var(--color-accent)" strokeWidth="1.4"/>
                <path d="M3 17l4-4 3 3 4-5 7 6" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="admin-section-card__title">Company Assets</div>
            <div className="admin-section-card__desc">Manage the logo library, fonts, and visual assets that power the branding calculator style picker.</div>
            <div className="admin-section-card__arrow">
              Manage assets
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
