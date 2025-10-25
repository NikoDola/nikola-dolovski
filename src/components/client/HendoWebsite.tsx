"use client";

import { useState, useEffect } from "react";
import "./BrandingCalculator.css";

interface ServiceOption {
  name: string;
  hours: number;
  price?: number;
  features?: string[];
}

interface Service {
  name: string;
  description: string;
  category: string;
  hours?: number;
  options?: ServiceOption[];
  selectedOption?: number;
  status: boolean;
  link?: string;
}

export default function HendoCalculator() {
  const [services, setServices] = useState<Service[]>([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hourlyRate = 32;

  useEffect(() => {
    const loadServices = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Try loading from localStorage first
        const savedData = getFromLocalStorage();
        if (savedData) {
          setServices(savedData);
          return;
        }

        // Fetch from API if no localStorage data
        const response = await fetch('/api/hendo-calculator');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format from API");
        }

        // Initialize services with default values
        const initialized = data.map((item: Service) => ({
          ...item,
          status: false,
          selectedOption: item.options ? 0 : undefined
        }));

        setServices(initialized);
        saveToLocalStorage(initialized);
      } catch (err) {
        console.error("Error loading services:", err);
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        setServices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);


  // Helper functions for localStorage
  const getFromLocalStorage = (): Service[] | null => {
    try {
      const savedData = localStorage.getItem('hendo-calculator');
      return savedData ? JSON.parse(savedData) : null;
    } catch (e) {
      console.warn("LocalStorage access failed", e);
      return null;
    }
  };

  const saveToLocalStorage = (data: Service[]) => {
    try {
      localStorage.setItem('hendo-calculator', JSON.stringify(data));
    } catch (e) {
      console.warn("LocalStorage save failed", e);
    }
  };

  const updateServices = (updatedServices: Service[]) => {
    setServices(updatedServices);
    saveToLocalStorage(updatedServices);
  };

  const handleToggle = (itemName: string) => {
    const updated = services.map(item =>
      item.name === itemName ? { ...item, status: !item.status } : item
    );
    updateServices(updated);
  };

  const handleOptionChange = (itemName: string, optionIndex: number) => {
    const updated = services.map(item =>
      item.name === itemName ? { ...item, selectedOption: optionIndex } : item
    );
    updateServices(updated);
  };

  const toggleDescription = (itemName: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  // Calculate derived values
  const categorizedServices = services.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Service[]>);

  const totalHours = services.reduce((sum, item) => {
    if (!item.status) return sum;
    const hours = item.options
      ? item.options[item.selectedOption || 0].hours
      : item.hours || 0;
    return sum + hours;
  }, 0);

  const categoryDiscounts = Object.entries(categorizedServices).reduce((acc, [category, items]) => {
    const allSelected = items.every(item => item.status);
    if (!allSelected) return acc;

    const categoryTotal = items.reduce((sum, item) => {
      const hours = item.options
        ? item.options[item.selectedOption || 0].hours
        : item.hours || 0;
      return sum + (item.status ? hours : 0);
    }, 0);

    acc[category] = Math.round(categoryTotal * hourlyRate * 0.2);
    return acc;
  }, {} as Record<string, number>);

  const totalDiscount = Object.values(categoryDiscounts).reduce((sum, discount) => sum + discount, 0);
  const grandTotal = (totalHours * hourlyRate) - totalDiscount;

  if (isLoading) return <div className="loading">Loading services...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (services.length === 0) return <div className="empty">No services available</div>;

  return (
    <div className="calculator">
      <div className="header">
        <h1>Hendo Website Calculator</h1>
        <p className="subtitle">Customize your music and merchandise website</p>
      </div>

      {Object.entries(categorizedServices).map(([category, items]) => {
        const allSelected = items.every(item => item.status);
        return (
          <div key={category} className="category">
            <div className="categoryHeader">
              <h2 className="categoryTitle">{category}</h2>
              {allSelected && <span className="discountBadge">20% OFF</span>}
            </div>

            {items.map((item) => (
              <ServiceItem
                key={item.name}
                item={item}
                expanded={!!expandedDescriptions[item.name]}
                onToggle={handleToggle}
                onOptionChange={handleOptionChange}
                onToggleDescription={toggleDescription}
              />
            ))}
          </div>
        );
      })}

      <CalculatorSummary
        totalHours={totalHours}
        hourlyRate={hourlyRate}
        totalDiscount={totalDiscount}
        grandTotal={grandTotal}
      />
    </div>
  );
}

// Sub-components for better organization
function ServiceItem({ item, expanded, onToggle, onOptionChange, onToggleDescription }: {
  item: Service;
  expanded: boolean;
  onToggle: (name: string) => void;
  onOptionChange: (name: string, index: number) => void;
  onToggleDescription: (name: string) => void;
}) {
  const selectedOption = item.options?.[item.selectedOption || 0];

  return (
    <div className={`service ${item.status ? 'selected' : ''}`}>
      <div className="serviceInfo">
        <h5 className="serviceName">{item.name}</h5>
        <p className="serviceHours">⏱ {selectedOption?.hours || item.hours} hours</p>

        <div className={`serviceDescription ${expanded ? 'expanded' : ''}`}>
          <p>{item.description}</p>
          {selectedOption?.features && (
            <ul className="featureList">
              {selectedOption.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
          )}
        </div>

        {item.options && (
          <div className="serviceOptions">
            {item.options.map((option, index) => (
              <div key={index} className="optionRow">
                <input
                  type="radio"
                  id={`${item.name}-${index}`}
                  name={item.name}
                  checked={item.selectedOption === index}
                  onChange={() => onOptionChange(item.name, index)}
                  disabled={!item.status}
                />
                <label htmlFor={`${item.name}-${index}`}>
                  {option.name} {option.price && `($${option.price})`}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="serviceActions">
        <button
          onClick={() => onToggleDescription(item.name)}
          className="readMoreButton"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
        <button
          onClick={() => onToggle(item.name)}
          className={`toggleButton ${item.status ? 'on' : 'off'}`}
        >
          {item.status ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}

function CalculatorSummary({ totalHours, hourlyRate, totalDiscount, grandTotal }: {
  totalHours: number;
  hourlyRate: number;
  totalDiscount: number;
  grandTotal: number;
}) {
  return (
    <div className="summary">
      <div className="summaryItem">
        <span>⏱ Total Hours:</span>
        <span>{totalHours} hours</span>
      </div>
      <div className="summaryItem">
        <span>🧾 Subtotal:</span>
        <span>${totalHours * hourlyRate}</span>
      </div>
      {totalDiscount > 0 && (
        <div className="summaryItem discount">
          <span>🎁 Discounts:</span>
          <span>-${totalDiscount}</span>
        </div>
      )}
      <div className="summaryItem total">
        <span>💰 Estimated Total:</span>
        <span>${grandTotal}</span>
      </div>
      <button
        className={`orderButton ${!totalHours ? "disabled" : ""}`}
        disabled={!totalHours}
      >
        Request Proposal
      </button>
    </div>
  );
}