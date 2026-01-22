import { useState } from 'react'
import './UpdatePassword.css'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'

const UpdatePassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { state } = useLocation()
  const email = state?.email

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

     const existingResetToken = localStorage.getItem('resetToken')

      if (!existingResetToken) {
          setError('resetToken is invalid')
          return
      }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    
    const body = {
      password,
      email
    }

    const response = await axios.post(import.meta.env.VITE_UPDATE_PASSWORD, body, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    
    if (response.data) {
      localStorage.removeItem('resetToken')
      localStorage.setItem('accessToken', response.data.access_token)
      navigate('/')
    }
  }

  return (
    <div className="updatePassword-center">
      <form className="updatePasswordScreen" onSubmit={handleSubmit}>
        <h2>Update Password</h2>

        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Update Password</button>
      </form>
    </div>
  )
}

export default UpdatePassword
