import { useRef, useState } from 'react'
import '../SignIn/SignIn.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const ResetPasswordOtpVerify = () => {
  const [userEmail, setUserEmail] = useState<string>('')
  const [validation, setValidation] = useState<boolean>(false)
  const [error, setError] = useState<string | boolean>()
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
      otp: otp,
      email: userEmail
    }
                                                                            
    const response = await axios.post(import.meta.env.VITE_FORGET_PASSWORD_ENTER_OTP, body, { 
      headers: {
      'Content-Type': 'application/json'
    }})
    
    const resetToken = response.data.resetToken
    if (response.data) {
      localStorage.setItem('resetToken', resetToken)
      navigate('/update-password', {
        state: {email: userEmail}
      })
    }
  }

  const handleOtpEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      if (!userEmail.trim()) {
        setError(false)
        setError('Enter your email')
        return 
      }
      setError('')

      setUserEmail(userEmail)
      const body = {
        email: userEmail
      }

      const response = await axios.post(import.meta.env.VITE_FORGET_PASSWORD_EMAIL_VERIFY, body, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setValidation(true)

      return response
    } catch(error: any) {
     setError(error.response?.data.message || "Failed OTP")
    }
  }
  

  return (<>
    {validation 
    ? 
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
    : 
       <div className="otp-page">
      <form className="otp-form" onSubmit={handleOtpEmail}>
        <div className='whereToSendForgetPassowrdOtp'>
          <b className='askEmailEnter'>Please Enter your Email</b>
          <input type="email" className='emailForOtp' value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
          <button className='sendOtpBtn'>Get OTP</button>
        </div>
        {error ? error : ''}
      </form>
    </div>
  }
  </>
  )

}

export default ResetPasswordOtpVerify

