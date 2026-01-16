import { Route, BrowserRouter as Router, Routes, } from 'react-router-dom'
import Header from './Header/Header'
import Home from './Home/Home'
import SignIn from './Auth/SignIn'
import MainLayout from './MainLayout'

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
      </Routes> 

       </Router>
    </div>
    </>
  )
}

export default App
