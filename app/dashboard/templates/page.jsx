"use client"

import Link from "next/link"

const templates = [
  {
    id: 1,
    name: "Landing Page",
    description: "Perfect for product launches and marketing campaigns",
    preview: "🎯",
  },
  {
    id: 2,
    name: "Blog Template",
    description: "Great for sharing articles and stories",
    preview: "📝",
  },
  {
    id: 3,
    name: "Portfolio",
    description: "Showcase your work and projects",
    preview: "🖼️",
  },
  {
    id: 4,
    name: "Services",
    description: "Highlight your services and expertise",
    preview: "🛠️",
  },
]

export default function TemplatesPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Page Templates</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
          >
            <div className="text-5xl mb-4 text-center">{template.preview}</div>
            <h3 className="text-lg font-bold text-foreground mb-2">{template.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
            <Link
              href="/dashboard/pages?action=new"
              className="block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
            >
              Use Template
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
