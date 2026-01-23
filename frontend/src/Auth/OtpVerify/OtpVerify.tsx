import { useRef } from 'react'
import '../SignIn/SignIn.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const OtpVerify = ({userId}: any) => {
  const navigate = useNavigate()
  const inputsRef = useRef<HTMLInputElement[]>([])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value

    // Allow only digits
    if (!/^\d?$/.test(value)) return

    // Move to next input if exists
    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Backspace moves focus to previous input
    if (e.key === 'Backspace' && !inputsRef.current[index].value && index > 0) {
      inputsRef.current[index - 1].focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const otp = inputsRef.current.map(input => input.value).join('')
    // Call your backend verification here

    const body = {
      userId: userId,
      otp: otp
    }
    const response = await axios.post(import.meta.env.VITE_OTPVERIFY, body, {
      headers: {
        "Content-Type": "application/json"
      }
    })

    
    const responsDataAuth = response.data.auth
    if (responsDataAuth === true) {
      localStorage.setItem('accessToken', response.data.access_token)
      navigate('/')
    }
  }

  return (
    <div className="otp-page">
      <form className="otp-form" onSubmit={handleSubmit}>
        <h2 className="otp-title">Enter OTP Code</h2>
        <p className="otp-subtitle">We sent a 6-digit code to your email</p>

        <div className="otp-inputs">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="otp-input"
              ref={(el) => {
                if (el) inputsRef.current[index] = el
              }}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button type="submit" className="otp-btn">
          Verify
        </button>
      </form>
    </div>
  )
}

export default OtpVerify
