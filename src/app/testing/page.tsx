"use client";

import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";

interface Item {
  name: string;
  description: string;
  status: boolean;
  hours: string;
  category: string;
}

export default function BrandingCalculator() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(!loading)
      try {
        const saved = localStorage.getItem("branding-calculator");
        if (saved) {
          setItems(JSON.parse(saved));
          return;
        }

        const response = await fetch("/api/branding-calculator");
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        localStorage.setItem("branding-calculator", JSON.stringify(data));
        setItems(data);
      } catch (error) {
        console.error("Error loading data:", error);  
      }
    }

    fetchData();
  }, []);

  const toggleStatus = (index: number) => {
    const updated = [...items];
    updated[index].status = !updated[index].status;
    setItems(updated);
    localStorage.setItem("branding-calculator", JSON.stringify(updated));
    console.log(updated[index].status);
  };

const totalHours = items.reduce((sum, item) => {
  return item.status ? sum + Number(item.hours) : sum;
}, 0);



return loading ? 
(<div>
 <Loading />
</div>
):
  (<form>
    {Object.entries(
      items.reduce<Record<string, Item[]>>((groups, item) => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
        return groups;
      }, {})
    ).map(([category, groupedItems]) => (
      <div key={category}>
        <h3>{category}</h3>
        {groupedItems.map((item, i) => (
          <div
            key={`${category}-${i}`}
            onClick={() => toggleStatus(items.indexOf(item))}
          >
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    ))}

    <button>Submit</button>
    <p>Total hours: {totalHours} Total Fee ${totalHours * 32}</p>
  </form>)
}