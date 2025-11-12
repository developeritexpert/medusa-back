import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    const post = await blogModuleService.retrievePost(id)

    res.json({
      post,
    })
  } catch (error) {
    console.error("Error fetching post:", error)
    res.status(404).json({
      message: "Post not found",
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
    const { id } = req.params

    const postData = {
      ...req.body,
      updatedAt: new Date(),
      publishedAt: req.body.isPublished ? new Date() : null,
    }

    const post = await blogModuleService.updatePosts({
      id,
      ...postData,
    })

    res.json({
      post,
    })
  } catch (error) {
    console.error("Error updating post:", error)
    res.status(500).json({
      message: "Failed to update post",
      error: error.message,
    })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    const blogModuleService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
    const { id } = req.params

    await blogModuleService.deletePosts(id)

    res.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting post:", error)
    res.status(500).json({
      message: "Failed to delete post",
      error: error.message,
    })
  }
}