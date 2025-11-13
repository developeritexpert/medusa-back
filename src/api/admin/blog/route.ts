import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"
import formidable from "formidable"
import fs from "fs"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "static", "uploads")

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const posts = await blogModuleService.listPosts()
    res.json({
      posts,
    })
  } catch (error) {
    console.error("Error fetching posts:", error)
    res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    })
  }
}

function parseForm(req: MedusaRequest): Promise<{ fields: any; files: any }> {
  return new Promise((resolve, reject) => {
    // Use the callable factory API (supported in newer formidable versions)
    const form = formidable({ multiples: false })
    form.parse(req as any, (err: any, fields: any, files: any) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)

    let postData: any = {}

    const contentType = (req.headers["content-type"] || "").toString()

    if (contentType.includes("multipart/form-data")) {
      // parse form and handle file
      const { fields, files } = await parseForm(req)

      postData = { ...fields }

      if (files && (files as any).thumbnail) {
        const file = (files as any).thumbnail
        const originalName = Array.isArray(file) ? file[0].originalFilename : file.originalFilename
        const tempPath = Array.isArray(file) ? file[0].filepath : file.filepath
        const ext = path.extname(originalName || "") || ""
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
        const dest = path.join(UPLOAD_DIR, fileName)
        // move file
        fs.copyFileSync(tempPath, dest)
        // remove temp file if different
        try { fs.unlinkSync(tempPath) } catch (e) { /* ignore */ }

        // set thumbnail URL to be served from /uploads/:name (public endpoint, no auth)
        postData.thumbnail = `/uploads/${fileName}`
      }
    } else {
      // JSON body
      postData = { ...(req.body as any) }
    }

    // Add timestamps
    const now = new Date()
    postData = {
      ...postData,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.isPublished ? now : null,
    }

    const post = await blogModuleService.createPosts(postData)

    res.json({ post })
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    })
  }
}