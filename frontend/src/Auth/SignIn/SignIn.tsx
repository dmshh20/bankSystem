import { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import OtpVerify from '../OtpVerify/OtpVerify';
import { Link } from 'react-router-dom';

const SignIn = () => {
  const [userId, setUserId] = useState<number>()
  const [validation, setValidation] = useState<boolean>(false)
  const [form, setForm] = useState({
    cardNumber: '',
    password: '',
  });
  

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  const validateEnteredData = async () => {
    try {
      
      const response = await axios.post(import.meta.env.VITE_SIGNIN, form, {
        headers: {  
          "Content-Type": 'application/json'
        }
      })
      
      setUserId(response.data.userId)
      setValidation(response.data.validate)
    } catch(error) {
      throw new Error('Failed in SignIn')
    }
  }


  return (
    <div className="signin-page">
      {validation 
      ?  <OtpVerify userId={userId}></OtpVerify>

      : <div className="signin-wrapper">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>

        <div className="input-group">
          <label>Card Number</label>
          <input
            type="text"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={form.cardNumber}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="signin-btn" onClick={validateEnteredData}>
          Sign In
        </button>

        <Link to="/signup" className='haveAnAccount'>
          <b className='haveAnAccount'>Haven't had an account yet?</b>
        </Link>

        <Link to='/' className='exitBtn'>
          <b className='exitBtn'>Exit</b>
        </Link>

        <Link to='/forgetpassword-email-verify' className='forgetPassoword'>
            <b className='forgetPassoword'>Forgot a password or cardNumber?</b>
        </Link>
      </form>
    </div>}
    
    </div>
  );
};

export default SignIn;
