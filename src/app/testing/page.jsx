"use client"

import { useState, useEffect } from "react"
import "@/app/_styles/pages/testing/testing.css"

export default function Testing() {
  const [services, setServices] = useState([])
  const [totalHours, setTotalHours] = useState(0)
  const [expandedDescriptions, setExpandedDescriptions] = useState({})
  const hourlyRate = 32

  useEffect(() => {
    try {
      fetch('/api/branding-calculator')
        .then(res => res.json())
        .then(data => {
          const initialized = data.map(item => ({
            ...item,
            status: false 
          }))
          setServices(initialized)

          const saved = localStorage.getItem('branding-calculator')
          if (!saved) {
            localStorage.setItem('branding-calculator', JSON.stringify(initialized))
          }
        })
    } catch (error) {
      console.error(error)
    }
  }, [])

  const handleToggle = (itemName) => {
    let newTotalHours = totalHours

    const updated = services.map(item => {
      if (item.name === itemName) {
        const toggled = { ...item, status: !item.status }

        if (toggled.status) {
          newTotalHours += Number(toggled.hours)
        } else {
          newTotalHours -= Number(toggled.hours)
        }

        return toggled
      }
      return item
    })

    setServices(updated)
    setTotalHours(newTotalHours)
    localStorage.setItem('branding-calculator', JSON.stringify(updated))
  }

  const toggleDescription = (itemName) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const categorizedServices = services.reduce((bag, item) => {
    const category = item.category
    if (!bag[category]) {
      bag[category] = []
    }
    bag[category].push(item)
    return bag
  }, {})

  return (
    <div className="calculator">
      <div className="header">
        <h1>Branding Calculator</h1>
      </div>

      {Object.entries(categorizedServices).map(([category, items]) => (
        <div key={category} className="category">
          <h2 className="categoryTitle">{category}</h2>
          {items.map((item, index) => (
            <div key={index} className="service">
              <div className="serviceInfo">
                <h3 className="serviceName">{item.name}</h3>
                <p className="serviceHours">{item.hours} hours</p>
                <div className={`serviceDescription ${expandedDescriptions[item.name] ? 'expanded' : ''}`}>
                  {item.description}
                  {item.link && (
                    <a href={item.link} className="findOutMore" target="_blank" rel="noopener noreferrer">
                      Find out more
                    </a>
                  )}
                </div>
              </div>
              <div className="serviceActions">
  
                <button 
                  onClick={() => toggleDescription(item.name)}
                  className="readMoreButton"
                >
                  {expandedDescriptions[item.name] ? 'Read less' : 'Read more'}
                </button>
                              <button
                  onClick={() => handleToggle(item.name)}
                  className={`toggleButton ${item.status ? 'on' : 'off'}`}
                >
                  {item.status ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="summary">
        <div className="summaryItem">
          <span>Total Hours:</span>
          <span>{totalHours} hours</span>
        </div>
        <div className="summaryItem">
          <span>Hourly Rate:</span>
          <span>${hourlyRate}/hour</span>
        </div>
        <div className="summaryItem total">
          <span>Estimated Total:</span>
          <span>${totalHours * hourlyRate}</span>
        </div>
      </div>
    </div>
  )
}