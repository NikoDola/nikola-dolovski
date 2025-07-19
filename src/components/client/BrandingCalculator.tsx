"use client"

import { useState, useEffect } from "react"
import "./BrandingCalculator.css"

interface ServiceOption {
  name: string
  hours: number
}

interface Service {
  name: string
  description: string
  category: string
  hours?: number
  options?: ServiceOption[]
  selectedOption?: number
  status: boolean
  link?: string
}

export default function BrandingCalculator() {
  const [services, setServices] = useState<Service[]>([])
  const [totalHours, setTotalHours] = useState(0)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [categoryDiscounts, setCategoryDiscounts] = useState<Record<string, number>>({})
  const hourlyRate = 32

useEffect(() => {
  const loadServices = async () => {
    try {
      // First try to load from localStorage
      const savedData = localStorage.getItem('branding-calculator')
      
      if (savedData) {
        const parsedData = JSON.parse(savedData) as Service[]
        setServices(parsedData)
        calculateTotalHours(parsedData)
        calculateCategoryDiscounts(parsedData)
        return
      }

      // If no localStorage data, fetch from API
      const response = await fetch('/api/branding-calculator')
      const data: Service[] = await response.json()
      const initialized = data.map((item: Service) => ({
        ...item,
        status: false,
        selectedOption: item.options ? 0 : undefined
      }))
      
      setServices(initialized)
      localStorage.setItem('branding-calculator', JSON.stringify(initialized))
    } catch (error) {
      console.error("Error loading services:", error)
    }
  }

  loadServices()
}, [])

  const calculateTotalHours = (services: Service[]) => {
    const total = services.reduce((sum, item) => {
      if (item.status) {
        const hours = item.options ? item.options[item.selectedOption || 0].hours : item.hours || 0
        return sum + hours
      }
      return sum
    }, 0)
    setTotalHours(total)
  }

  const calculateCategoryDiscounts = (services: Service[]) => {
    const categories = [...new Set(services.map(item => item.category))]
    const newDiscounts: Record<string, number> = {}
    
    categories.forEach(category => {
      const categoryItems = services.filter(item => item.category === category)
      const allSelected = categoryItems.every(item => item.status)
      
      if (allSelected) {
        const categoryTotal = categoryItems.reduce((sum, item) => {
          const hours = item.options ? item.options[item.selectedOption || 0].hours : item.hours || 0
          return sum + (item.status ? hours : 0)
        }, 0)
        newDiscounts[category] = Math.round(categoryTotal * hourlyRate * 0.2)
      } else {
        newDiscounts[category] = 0
      }
    })
    
    setCategoryDiscounts(newDiscounts)
    return newDiscounts
  }

  const updateServices = (updatedServices: Service[]) => {
    setServices(updatedServices)
    calculateTotalHours(updatedServices)
    calculateCategoryDiscounts(updatedServices)
    localStorage.setItem('branding-calculator', JSON.stringify(updatedServices))
  }

  const handleToggle = (itemName: string) => {
    const updated = services.map(item => {
      if (item.name === itemName) {
        return { ...item, status: !item.status }
      }
      return item
    })
    updateServices(updated)
  }

  const handleOptionChange = (itemName: string, optionIndex: number) => {
    const updated = services.map(item => {
      if (item.name === itemName) {
        return { ...item, selectedOption: optionIndex }
      }
      return item
    })
    updateServices(updated)
  }

  const toggleDescription = (itemName: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const categorizedServices = services.reduce((bag: Record<string, Service[]>, item) => {
    const category = item.category
    if (!bag[category]) {
      bag[category] = []
    }
    bag[category].push(item)
    return bag
  }, {})

  const totalDiscount = Object.values(categoryDiscounts).reduce((sum, discount) => sum + discount, 0)
  const grandTotal = (totalHours * hourlyRate) - totalDiscount

  return (
    <div className="calculator">
      <div className="header">
        <h1>Branding Calculator</h1>
      </div>

      {Object.entries(categorizedServices).map(([category, items]) => {
        const allSelected = items.every(item => item.status)
        return (
          <div key={category} className="category">
            <div className="categoryHeader">
              <h2 className="categoryTitle">{category}</h2>
              {allSelected && (
                <span className="discountBadge">20% OFF</span>
              )}
            </div>
            {items.map((item, index) => (
              <div key={index} className="service">
                <div className="serviceInfo">
                  <h5 className="serviceName">{item.name}</h5>
     <p className="serviceHours"> &#128338;
  {item.options 
    ? `${item.options[item.selectedOption || 0].hours} hours` 
    : `${item.hours} hours`
  }
</p>
                  <div className={`serviceDescription ${expandedDescriptions[item.name] ? 'expanded' : ''}`}>
                    {item.description}
                    {item.link && (
                      <a href={item.link} className="findOutMore" target="_blank" rel="noopener noreferrer">
                        Find out more
                      </a>
                    )}
                  </div>
                  
                  {item.options && (
                    <div className="serviceOptions">
                      {item.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="optionRow">
                          <input
                            type="radio"
                            id={`${item.name}-${optionIndex}`}
                            name={item.name}
                            checked={item.selectedOption === optionIndex}
                            onChange={() => handleOptionChange(item.name, optionIndex)}
                            disabled={!item.status}
                          />
                          <label htmlFor={`${item.name}-${optionIndex}`}>
                            {option.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="serviceActions">
                  <div className="actionButtons">
                    <button 
                      onClick={() => toggleDescription(item.name)}
                      className="readMoreButton"
                    >
                      {expandedDescriptions[item.name] ? 'Hide Service Description' : 'See Service Description'}
                    </button>
                    <button
                      onClick={() => handleToggle(item.name)}
                      className={`toggleButton ${item.status ? 'on' : 'off'}`}
                    >
                      {item.status ? "Selected" : "Select"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      })}

      <div className="summary">
        <div className="summaryItem">
          <span>Total Hours:</span>
          <span>{totalHours} hours</span>
        </div>
        <div className="summaryItem">
          <span>Subtotal:</span>
          <span>${totalHours * hourlyRate}</span>
        </div>
        {totalDiscount > 0 && (
          <div className="summaryItem discount">
            <span>Discounts:</span>
            <span>-${totalDiscount}</span>
          </div>
        )}
        <div className="summaryItem total">
          <span>Estimated Total:</span>
          <span>${grandTotal}</span>
        </div>
      </div>
    </div>
  )
}