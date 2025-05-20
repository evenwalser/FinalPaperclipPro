// components/SendInviteForm.tsx
import { useState, ChangeEvent, FormEvent } from 'react'

export default function SendInviteForm() {
  const [email, setEmail] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const res = await fetch('/api/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessage('Invitation sent successfully!')
      setEmail('')
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter email to invite"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Invite'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}
