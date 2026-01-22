import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import Home from './Home/Home'
import SignIn from './Auth/SignIn/SignIn'
import MainLayout from './MainLayout'
import SignUp from './Auth/SignUp/SignUp'
import Logout from './Auth/Logout/Logout'
import ResetPasswordOtpVerify from './Auth/OtpVerify/forgetPasswordOtpVerify'

const App = () => {
  return (
    <>
    <div className='app'>
       <Router>

          <Routes>
           <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/forgetpassword-otp-verify" element={<ResetPasswordOtpVerify/>} />
      </Routes> 

       </Router>
    </div>
    </>
  )
}

export default App
