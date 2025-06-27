// app/addNew/page.tsx
"use client";
import { useState } from "react";
import { addLogoInspiration } from "@/lib/actions/inspirationService";
import { RadioGroup, CheckboxGroup } from "@/components/ui/Form";
import { TagsInput } from "@/components/ui/TagsInput"
import "@/app/_styles/pages/addNew.css";

export default function AddNew() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File>();

  const [tags, setTags] = useState<string[]>([]);
  
  const [style, setStyle] = useState({
    era: "",
    years: [] as string[],
    formStyle: "",
    colorStyle: "",
    age: "",
    materialism: "",
    negativeSpace: "",
    logoType: [] as string[],
    outlineStyle: "",
    colorCount: "",
    designerName: "",
    quality: "",
    gender: "",
    tags: [] as string[],
    timeStamp: new Date(),
    complexity: "",
    logoSubject: "",
    obviousAbstract: "",
  });

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Basic validation
  if (!file) {
    setError("Please select an image file");
    return;
  }

  setIsSubmitting(true);
  setError(null);

  try {
    // Prepare the data object matching the InspirationData interface
    const inspirationData = {
      era: style.era,
      designerName: style.designerName,
      years: style.years,
      formStyle: style.formStyle,
      colorStyle: style.colorStyle,
      age: style.age,
      materialism: style.materialism,
      negativeSpace: style.negativeSpace,
      logoType: style.logoType,
      colorCount: style.colorCount,
      quality: style.quality,
      tags: tags, // Using the separate tags state
      timeStamp: new Date(), // Matches the interface's Date type
      obviousAbstract: style.obviousAbstract
    };

    // Call the service
    const result = await addLogoInspiration.create(inspirationData, file);
    
    // Reset form after successful submission
    setStyle({
      era: "",
      years: [],
      formStyle: "",
      colorStyle: "",
      age: "",
      materialism: "",
      negativeSpace: "",
      logoType: [],
      outlineStyle: "",
      colorCount: "",
      designerName: "",
      quality: "",
      gender: "",
      tags: [],
      timeStamp: new Date(),
      complexity: "",
      logoSubject: "",
      obviousAbstract: "",
    });
    setTags([]);
    setFile(undefined);
  
    
    alert(`Logo added successfully with ID: ${result.id}`);
    
  } catch (err) {
    console.error("Submission error:", err);
    setError(
      err instanceof Error 
        ? err.message 
        : "An unexpected error occurred during submission"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <main className="section-regular">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="form-section">
          <h3 className="section-title">Logo Image</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) {setFile(selectedFile)}
            }}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Designer Info */}
        <div className="form-section">
          <h3 className="section-title">Design Information</h3>
          
          <div className="input-group">
            <label htmlFor="designerName">Designer Name</label>
            <input
              id="designerName"
              type="text"
              value={style.designerName}
              onChange={(e) => setStyle({ ...style, designerName: e.target.value })}
              placeholder="Enter designer name"
              required
            />
          </div>

          <div className="quality-rating">
            <h4>Quality Rating</h4>
            <RadioGroup
              title=""
              name="quality"
              options={["q1", "q2", "q3"].map((q) => ({
                value: q,
                label: `Quality ${q.charAt(1)}`
              }))}
              currentValue={style.quality}
              onChange={(quality) => setStyle({ ...style, quality })}
            />
          </div>
          
          <RadioGroup
            title="Gender Appeal"
            name="gender"
            options={[
              { value: "manly", label: "Manly" },
              { value: "feminine", label: "Feminine" },
              { value: "unisex", label: "Unisex" },
            ]}
            currentValue={style.gender}
            onChange={(gender) => setStyle({ ...style, gender })}
          />
        </div>

        <TagsInput
          tags={tags}
          onAddTag={(tag) => setTags([...tags, tag])}
          onRemoveTag={(tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove))}
        />

        {/* Era Selection */}
        <RadioGroup
          title="Era"
          name="era"
          options={[
            { value: "modern", label: "Modern" },
            { value: "vintage", label: "Vintage" },
          ]}
          currentValue={style.era}
          onChange={(era) => setStyle({ ...style, era, years: [] })}
        />

        {style.era === "vintage" && (
          <CheckboxGroup
            title="Vintage Years"
            options={["1940", "1950", "1960", "1970", "1980"]}
            selectedOptions={style.years}
            onChange={(years) => setStyle({ ...style, years })}
          />
        )}

            {/* Modern Era Controls */}
            <RadioGroup
              title="Form Style"
              name="formStyle"
              options={[
                { value: "organic", label: "Organic" },
                { value: "both", label: "Both" },
                { value: "geometric", label: "Geometric" },
              ]}
              currentValue={style.formStyle}
              onChange={(formStyle) => setStyle({ ...style, formStyle })}
            />



            <RadioGroup
               title="Obvious Abstract"
              name="obviousAbstract"
              options={[
                { value: "obvious", label: "Obvious" },
                { value: "between", label: "Between" },
                { value: "abstract", label: "Abstract" }
              ]}
              currentValue={style.obviousAbstract}
              onChange={(obviousAbstract) => setStyle({ ...style, obviousAbstract })}
            />

            <RadioGroup
              title="Color Style"
              name="colorStyle"
              options={[
                { value: "flat", label: "Flat" },
                { value: "gradient", label: "Gradient" },
              ]}
              currentValue={style.colorStyle}
              onChange={(colorStyle) => setStyle({ ...style, colorStyle })}
            />

            <RadioGroup
              title="Age Style"
              name="age"
              options={[
                { value: "youthful", label: "Youthful" },
                 { value: "between", label: "Between" },
                { value: "mature", label: "Mature" },
              ]}
              currentValue={style.age}
              onChange={(age) => setStyle({ ...style, age })}
            />

            <RadioGroup
              title="Materialism"
              name="materialism"
              options={[
                { value: "luxury", label: "Luxury" },
                 { value: "between", label: "Between" },
                { value: "economical", label: "Economical" },
              ]}
              currentValue={style.materialism}
              onChange={(materialism) => setStyle({ ...style, materialism })}
            />

            <RadioGroup
              title="Negative Space"
              name="negativeSpace"
              options={[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]}
              currentValue={style.negativeSpace}
              onChange={(negativeSpace) => setStyle({ ...style, negativeSpace })}
            />

            <RadioGroup
              title="Complexity"
              name="complexity"
              options={[
                { value: "complex", label: "Complex" },
                { value: "between", label: "Between" },
                { value: "minimal", label: "Minimal" },
              ]}
              currentValue={style.complexity}
              onChange={(complexity) => setStyle({ ...style, complexity })}
            />

            <CheckboxGroup
              title="Logo Types"
              options={["Badge", "Text Logo", "Vertical Logo", "Logo"]}
              selectedOptions={style.logoType}
              onChange={(logoType) => setStyle({ ...style, logoType })}
            />

            <RadioGroup
              title="Color Count"
              name="colorCount"
              options={[
                { value: "1 color", label: "1 color" },
                { value: "2 colors", label: "2 colors" },
                { value: "3 colors", label: "3 colors" },
                { value: "4+ colors", label: "4+ colors" },
              ]}
              currentValue={style.colorCount}
              onChange={(colorCount) => setStyle({ ...style, colorCount })}
            />

            <RadioGroup
              title="Logo Subject"
              name="subjectType"
              options={[
                { value: "animal", label: "Animal" },
                { value: "human", label: "Human" },
                { value: "object", label: "Object" },
              ]}
              currentValue={style.logoSubject} // Note: This should probably be a separate state field
              onChange={(subjectType) => setStyle({ ...style, logoSubject: subjectType })}
            />
      
     
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting || !!error}
        >
          {isSubmitting ? "Saving..." : "Submit"}
        </button>
      </form>
    </main>
  );
}