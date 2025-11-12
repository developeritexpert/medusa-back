import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../modules/blog/service"
import { BLOG_MODULE } from "../../../modules/blog"

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

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    
    // Add timestamps
    const postData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: req.body.isPublished ? new Date() : null,
    }

    const post = await blogModuleService.createPosts(postData)

    res.json({
      post,
    })
  } catch (error) {
    console.error("Error creating post:", error)
    res.status(500).json({
      message: "Failed to create post",
      error: error.message,
    })
  }
}