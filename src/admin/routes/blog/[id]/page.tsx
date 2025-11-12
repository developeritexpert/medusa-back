import { Container, Heading, Input, Textarea, Button, Label, Switch } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

const BlogEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isCreate = id === "create"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    thumbnail: "",
    slug: "",
    isBestForYou: false,
    isPublished: false,
  })

  const [loading, setLoading] = useState(!isCreate)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isCreate) {
      fetchPost()
    }
  }, [id, isCreate])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/admin/blog/${id}`, {
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Failed to fetch post")
      }
      
      const data = await response.json()
      setFormData(data.post)
    } catch (error) {
      console.error("Error fetching post:", error)
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const url = isCreate ? "/admin/blog" : `/admin/blog/${id}`
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to save post")
      }

      // Successfully saved, navigate back to list
      navigate("/app/blog")
    } catch (error: any) {
      console.error("Error saving post:", error)
      setError(error.message || "Failed to save post. Please try again.")
      setSaving(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading...</div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">
          {isCreate ? "Create Blog Post" : "Edit Blog Post"}
        </Heading>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <Label htmlFor="title" className="mb-2">
            Title *
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter post title"
          />
        </div>

        <div>
          <Label htmlFor="slug" className="mb-2">
            Slug *
          </Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            placeholder="post-url-slug"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used in the URL: /blog/{formData.slug || "post-url-slug"}
          </p>
        </div>

        <div>
          <Label htmlFor="description" className="mb-2">
            Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
            placeholder="Brief description of the post"
          />
        </div>

        <div>
          <Label htmlFor="content" className="mb-2">
            Content *
          </Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={12}
            required
            placeholder="Write your blog post content here..."
          />
        </div>

        <div>
          <Label htmlFor="thumbnail" className="mb-2">
            Thumbnail URL
          </Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && (
            <div className="mt-2">
              <img
                src={formData.thumbnail}
                alt="Thumbnail preview"
                className="w-32 h-32 object-cover rounded border"
                onError={(e) => {
                  e.currentTarget.style.display = "none"
                }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
          <Switch
            id="isBestForYou"
            checked={formData.isBestForYou}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isBestForYou: checked }))
            }
          />
          <Label htmlFor="isBestForYou" className="cursor-pointer">
            Best for You (Featured Post)
          </Label>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded">
          <Switch
            id="isPublished"
            checked={formData.isPublished}
            onCheckedChange={(checked) =>
              setFormData((prev) => ({ ...prev, isPublished: checked }))
            }
          />
          <Label htmlFor="isPublished" className="cursor-pointer">
            Published (Visible to public)
          </Label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Post"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/app/blog")}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  )
}

export default BlogEditPage