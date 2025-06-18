'use client'

import { useState, useEffect } from 'react'

type User = {
  id: number
  name: string
  email: string
}

export default function UserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/prisma', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })

    if (res.ok) {
      setName('')
      setEmail('')
      fetchUsers()
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="border p-1"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-1"
          required
        />
        <button type="submit" className="bg-black text-white px-2 py-1">
          Create User
        </button>
      </form>

      <h2 className="text-lg font-bold mb-2">Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {users.map(user => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
