import { NextResponse } from "next/server";
import {promises as fs} from "fs"
import path from "path"
const pathDirectory = path.join(process.cwd())

export async function GET() {
  try {
   
    const readFile = await fs.readFile(`${pathDirectory}/data/branding-calculator.json`, "utf-8")
    const parseData = JSON.parse(readFile)
      return NextResponse.json(parseData)
  } catch (error) {
    console.error(error)
  }

}