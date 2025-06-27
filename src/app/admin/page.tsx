import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function AdminPage() { // ← Note the async keyword
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value // ← No await needed here
  
  if (!session) {
    redirect('/login')
  }

  return <div>Admin Dashboard</div>
}