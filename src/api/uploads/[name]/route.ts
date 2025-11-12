import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import fs from "fs"
import path from "path"

export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  try {
    const { name } = req.params
    if (!name) {
      res.status(400).json({ message: "Missing file name" })
      return
    }

    const filePath = path.join(process.cwd(), "static", "uploads", name as string)
    
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ message: "File not found" })
      return
    }

    const ext = path.extname(filePath).toLowerCase()
    let contentType = "application/octet-stream"
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg"
    else if (ext === ".png") contentType = "image/png"
    else if (ext === ".webp") contentType = "image/webp"
    else if (ext === ".gif") contentType = "image/gif"

    res.setHeader("Content-Type", contentType)
    res.setHeader("Cache-Control", "public, max-age=31536000")
    const stream = fs.createReadStream(filePath)
    stream.pipe(res as any)
  } catch (err) {
    console.error("Error serving upload:", err)
    res.status(500).json({ message: "Failed to serve file", error: (err as any).message })
  }
}
