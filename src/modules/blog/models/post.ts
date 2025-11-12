import { model } from "@medusajs/framework/utils"

const Post = model.define("post", {
  id: model.id().primaryKey(),
  title: model.text(),
  content: model.text(),
  thumbnail: model.text().nullable(), // URL to the thumbnail image
  slug: model.text(),
  isBestForYou: model.boolean().default(false), // "Best for you" flag
  isPublished: model.boolean().default(false),
  publishedAt: model.dateTime().nullable(),
  createdAt: model.dateTime().default(() => new Date()),
  updatedAt: model.dateTime().default(() => new Date()),
})

export default Post