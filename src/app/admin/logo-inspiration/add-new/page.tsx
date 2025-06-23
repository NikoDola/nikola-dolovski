"use client";
import "@/app/_styles/pages/addNew.css";
import { useEffect, useState } from "react";
import { addInspiration } from "@/lib/actions/inspiration";

export default function AddNew() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [style, setStyle] = useState({
    era: "",
    years: [] as string[],
    formStyle: "",
    colorStyle: "",
    age: "",
    materialism: "",
    negativeSpace: "",
    logoType: [] as string[],
    designElements: [] as string[],
    colorCount: "",
    designerName: "",
    quality: "",
    timeStamp: new Date()
  });

  useEffect(() => {
    console.log(style);
  }, [style]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      await addInspiration(style, file || undefined);
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
        designElements: [],
        colorCount: "",
        designerName: "",
        quality: "",
        timeStamp: new Date()
      });
      setFile(null);
      setPreviewUrl(null);
      alert("Inspiration added successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to add inspiration. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const renderRadioGroup = (
    title: string,
    name: string,
    options: { value: string; label: string }[],
    currentValue: string,
    onChange: (value: string) => void
  ) => (
    <div className="form-section">
      <h3 className="section-title">{title}</h3>
      <div className="radios-wrapper">
        {options.map((option) => (
          <label key={option.value} className="radio-wrapper">
            <input
              className="radio-input"
              type="radio"
              name={name}
              checked={currentValue === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="radio-label">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCheckboxGroup = (
    title: string,
    options: string[],
    selectedOptions: string[],
    onChange: (options: string[]) => void
  ) => (
    <div className="form-section">
      <h3 className="section-title">{title}</h3>
      <div className="checkboxes-wrapper">
        {options.map((option) => (
          <label key={option} className="checkbox-wrapper">
            <input
              className="checkbox-input"
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={(e) =>
                onChange(
                  e.target.checked
                    ? [...selectedOptions, option]
                    : selectedOptions.filter((o) => o !== option)
                )
              }
            />
            <span className="checkbox-label">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <main className="section-regular">
      <form className="form-wrapper" onSubmit={handleSubmit}>
        <div className="form-section">
          <h3 className="section-title">Image Upload</h3>
          <div className="file-upload-wrapper">
            <label className="file-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-upload-input"
                required
              />
              <span className="file-upload-button">Choose File</span>
              <span className="file-upload-name">
                {file ? file.name : "No file chosen"}
              </span>
            </label>
            {previewUrl && (
              <div className="image-preview">
                <img src={previewUrl} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>
        </div>

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
            <div className="radios-wrapper">
              {["q1", "q2", "q3"].map((quality) => (
                <label key={quality} className="radio-wrapper">
                  <input
                    className="radio-input"
                    type="radio"
                    name="quality"
                    checked={style.quality === quality}
                    onChange={() => setStyle({ ...style, quality })}
                  />
                  <span className="radio-label">Quality {quality.charAt(1)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Era Selection */}
        {renderRadioGroup(
          "Era",
          "era",
          [
            { value: "modern", label: "Modern" },
            { value: "vintage", label: "Vintage" },
          ],
          style.era,
          (era) => setStyle((prev) => ({ ...prev, era, years: [] }))
        )}

        {style.era === "vintage" ? (
          renderCheckboxGroup(
            "Vintage Years",
            ["1940", "1950", "1960", "1970", "1980"],
            style.years,
            (years) => setStyle((prev) => ({ ...prev, years }))
          )
        ) : style.era === "modern" ? (
          <>
            {renderRadioGroup(
              "Form Style",
              "formStyle",
              [
                { value: "organic", label: "Organic" },
                { value: "geometric", label: "Geometric" },
              ],
              style.formStyle,
              (formStyle) => setStyle((prev) => ({ ...prev, formStyle }))
            )}

            {renderRadioGroup(
              "Color Style",
              "colorStyle",
              [
                { value: "flat", label: "Flat" },
                { value: "gradient", label: "Gradient" },
              ],
              style.colorStyle,
              (colorStyle) => setStyle((prev) => ({ ...prev, colorStyle }))
            )}

            {renderRadioGroup(
              "Age Style",
              "age",
              [
                { value: "youthful", label: "Youthful" },
                { value: "mature", label: "Mature" },
              ],
              style.age,
              (age) => setStyle((prev) => ({ ...prev, age }))
            )}

            {renderRadioGroup(
              "Materialism",
              "materialism",
              [
                { value: "luxury", label: "Luxury" },
                { value: "economical", label: "Economical" },
              ],
              style.materialism,
              (materialism) => setStyle((prev) => ({ ...prev, materialism }))
            )}

            {renderRadioGroup(
              "Negative Space",
              "negativeSpace",
              [
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ],
              style.negativeSpace,
              (negativeSpace) => setStyle((prev) => ({ ...prev, negativeSpace }))
            )}

            {renderCheckboxGroup(
              "Logo Types",
              ["badge", "textLogo", "verticalLogo", "horizontalLogo"],
              style.logoType,
              (logoType) => setStyle((prev) => ({ ...prev, logoType }))
            )}

            {renderCheckboxGroup(
              "Design Elements",
              ["character", "monogram", "object", "illustration", "logo", "ui"],
              style.designElements,
              (designElements) => setStyle((prev) => ({ ...prev, designElements }))
            )}

            {renderRadioGroup(
              "Color Count",
              "colorCount",
              [
                { value: "1 color", label: "1 color" },
                { value: "2 colors", label: "2 colors" },
                { value: "3 colors", label: "3 colors" },
                { value: "4+ colors", label: "4+ colors" },
              ],
              style.colorCount,
              (colorCount) => setStyle((prev) => ({ ...prev, colorCount }))
            )}
          </>
        ) : null}
     
        <button 
          type="submit" 
          className="submit-button"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </main>
  );
}