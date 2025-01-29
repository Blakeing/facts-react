import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">About</h1>
      <p className="text-gray-600">
        This is a demo dashboard application showcasing TanStack Router and modern React patterns.
      </p>
    </div>
  )
}
