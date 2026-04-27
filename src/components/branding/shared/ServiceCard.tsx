"use client"
import "./ServiceCard.css"

interface ServiceCardProps {
  title:       string
  description: string
  price:       string
  icon:        React.ReactNode
  selected:    boolean
  onClick:     () => void
  badge?:      string
}

export default function ServiceCard({ title, description, price, icon, selected, onClick, badge }: ServiceCardProps) {
  return (
    <div
      onClick={onClick}
      className={`service-card ${selected ? "service-card--selected" : ""}`}
    >
      {selected && (
        <div className="service-card__check">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
      {badge && (
        <div className="service-card__badge">{badge}</div>
      )}
      <div className="service-card__icon">{icon}</div>
      <div className="service-card__title">{title}</div>
      <div className="service-card__description">{description}</div>
      <div className="service-card__price">
        <span className="service-card__price-amount">${price}</span>
        <span className="service-card__price-label">flat rate</span>
      </div>
    </div>
  )
}
