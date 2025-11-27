import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-foreground">CMS</div>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 text-foreground hover:text-primary transition-colors">
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
          Create Beautiful Pages Without Code
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Our intuitive CMS lets you build stunning landing pages with drag-and-drop components. No coding required.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-bold text-lg"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 font-bold text-lg"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-card py-16 border-y border-border mt-12">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Powerful Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "Drag & Drop Editor",
                description: "Build pages visually with our intuitive editor",
              },
              {
                icon: "📱",
                title: "Responsive Design",
                description: "Pages look great on all devices automatically",
              },
              {
                icon: "⚡",
                title: "Fast Publishing",
                description: "Publish your pages instantly to the web",
              },
              {
                icon: "🖼️",
                title: "Rich Components",
                description: "Add text, images, videos, and more",
              },
              {
                icon: "👀",
                title: "Live Preview",
                description: "See changes in real-time as you build",
              },
              {
                icon: "🔒",
                title: "Secure & Reliable",
                description: "Your pages are safe with us",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-background rounded-lg p-6 border border-border">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Build?</h2>
        <p className="text-lg text-muted-foreground mb-8">
          Create your account and start building amazing pages today.
        </p>
        <Link
          href="/register"
          className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-bold text-lg inline-block"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>© 2025 CMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
