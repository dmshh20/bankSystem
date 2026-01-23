import { useState } from 'react'
import axios from 'axios'
import './SignUp.css'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post(import.meta.env.VITE_SIGNUP, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setSuccess('Registration successful! You can now sign in.')
      navigate('/')
      return localStorage.setItem('accessToken', response.data.access_token)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2 className="signup-title">Sign Up</h2>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}

        <div className="input-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="surname">Surname</label>
          <input
            id="surname"
            name="surname"
            type="text"
            placeholder="Enter your surname"
            value={form.surname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>
        <Link to="/signin" className='haveAnAccount'>
          <b className='haveAnAccount'>Already have an account?</b>
        </Link>

         <Link to='/' className='exitBtn'>
          <b className='exitBtn'>Exit</b>
        </Link>
      </form>
    </div>
  )
}

export default SignUp
