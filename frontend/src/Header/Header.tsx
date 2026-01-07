import './Header.css'
import Home from '../images/Home.png'
import Logout from '../images/Logout.png'
import Setting from '../images/Setting.png'
import Toggle from '../images/toggle_off_black_24dp 2.png'
import Payment from '../images/Group 97.png'
import Profile from '../images/Profile.png'
import Calendar from '../images/Calendar.png'
import Document from '../images/Document.png'

const Header = () => {
  return (<>
   <header className='header'>
    <ul className='ul-list'>
        <div className='liAndIcon firstLiIcon'>    
            <img src={Home} alt="" />
            <li>Dashboard</li>
        </div>
        <div className='liAndIcon'>    
            <img src={Document} alt="" />
            <li>Documents</li>
        </div>
        <div className='liAndIcon'>    
            <img src={Payment} alt="" />
            <li>Payments</li>
        </div>
        <div className='liAndIcon'>    
            <img src={Calendar} alt="" />
            <li>Calendar</li>
        </div>
        <div className='liAndIcon'>    
            <img src={Profile} alt="" />
            <li>Profile</li>
        </div>
        <hr className='hrLine' />

         <div className='liAndIcon'>    
            <img src={Toggle} alt="" />
            <li>Darkmode</li>
        </div>
         <div className='liAndIcon'>    
            <img src={Setting} alt="" />
            <li>Settings</li>
        </div>
         <div className='liAndIcon'>    
            <img src={Logout} alt="" />
            <li>Logout</li>
        </div>

    </ul>

   </header>
  </>
  )
}

export default Header
