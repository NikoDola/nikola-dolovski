// app/admin/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value

  if (!session) {
    redirect('/auth')
  }

  return <>{children}</>
}
