import Link from 'next/link'

export default async function AdminPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '2rem', color: 'var(--secondary-color)', marginBottom: '2rem' }}>
        Admin Dashboard
      </h1>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
        <li><Link href="/admin/projects">Portfolio Projects (CMS)</Link></li>
        <li><Link href="/admin/blog">Blog</Link></li>
        <li><Link href="/admin/pricing">Custom Service</Link></li>
        <li><Link href="/admin/logo-inspiration">Logo Inspiration</Link></li>
        <li><Link href="/admin/social">Social Media</Link></li>
      </ul>
    </div>
  )
}
