import { Container, Heading } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { BookOpen } from "@medusajs/icons"

const BlogPage = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch("/admin/blog", {
        credentials: "include",
      })
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      await fetch(`/admin/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      fetchPosts()
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-4">
        <Heading level="h1">Blog Posts</Heading>
        
         <a href="/app/blog/create"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </a>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No blog posts yet. Create your first post!
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: any) => (
            <div
              key={post.id}
              className="border rounded-lg p-4 flex items-start gap-4"
            >
              {post.thumbnail && (
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                {/* Description removed; use excerpt from content if needed */}
                <div className="mt-2 flex gap-2">
                  {post.isBestForYou && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                      Best for You
                    </span>
                  )}
                  {post.isPublished && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                      Published
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                
                <a href={`/app/blog/${post.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </a>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}

export default BlogPage

export const config = defineRouteConfig({
  label: "Blog",
  icon: BookOpen,
})