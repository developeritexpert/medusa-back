import { defineWidgetConfig } from "@medusajs/admin-sdk"

const BlogSidebarLink = () => {
  return (
    
     <a href="/app/blog"
      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 rounded"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
      Blog
    </a>
  )
}

export const config = defineWidgetConfig({
  zone: "settings.after",
})

export default BlogSidebarLink