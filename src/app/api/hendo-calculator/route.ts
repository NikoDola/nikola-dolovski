import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

// Helper function to validate data structure
interface Service {
  name: string;
  description: string;
  category: string;
  hours?: number;
  options?: Array<{
    name: string;
    hours: number;
    features?: string[];
  }>;
}

export async function GET() {
  try {
    // Construct absolute path to data file
    const dataPath = path.join(process.cwd(), "data", "hendo-calculator.json");
    console.log("Attempting to read file at:", dataPath);

    // Read and parse the file
    const fileContents = await fs.readFile(dataPath, "utf-8");
    const jsonData = JSON.parse(fileContents);

    // Validate data structure
    if (!Array.isArray(jsonData)) {
      throw new Error("Data is not an array");
    }

    // Initialize with default values
    const initializedData = jsonData.map((item: Service) => ({
      ...item,
      status: false,
      selectedOption: item.options ? 0 : undefined
    }));

    return NextResponse.json(initializedData);
  } catch (error) {
    console.error("API Error Details:", error);
    return NextResponse.json(
      {
        error: "Failed to load calculator data",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: process.env.NODE_ENV === "development" 
          ? error instanceof Error ? error.stack : undefined 
          : undefined
      },
      { status: 500 }
    );
  }
}