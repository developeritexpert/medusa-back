import { MedusaService } from "@medusajs/framework/utils"
import Post from "./models/post"

class BlogModuleService extends MedusaService({
  Post,
}) {
  // Additional custom methods can be added here if needed
  async getPublishedPosts() {
    return await this.listPosts({
      isPublished: true
    })
  }

  async getBestForYouPosts() {
    return await this.listPosts({
      isBestForYou: true,
      isPublished: true
    })
  }
}

export default BlogModuleService