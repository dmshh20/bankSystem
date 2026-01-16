import { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import OtpVerify from './OtpVerify';

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
      console.log('check',form);
      
      const response = await axios.post(import.meta.env.VITE_SIGNIN, form, {
        headers: {
          "Content-Type": 'application/json'
        }
      })
      
      console.log('RES', response.data);
      setUserId(response.data.userId)
      setValidation(response.data.validate)
    } catch(error) {
      console.log("OOOO",error);
      
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
      </form>
    </div>}
    
    </div>
  );
};

export default SignIn;
