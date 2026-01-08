import './Header.css'
import Home from '../images/Home.png'
import Logout from '../images/Logout.png'
import Setting from '../images/Setting.png'
import Toggle from '../images/toggle_off_black_24dp 2.png'
import Payment from '../images/Group 97.png'
import Profile from '../images/Profile.png'
import Calendar from '../images/Calendar.png'
import Document from '../images/Document.png'
import DashBoard from '../Dashboard/DashBoard'
import { useState } from 'react'
import ExchangeCurrency from '../ExchangeCurrency/ExchangeCurrency'
import Transfer from '../Transfer/Transfer'

const Header = () => {
    const [isDashBoard, setIsDashBoard] = useState<boolean>(false)
    const [isExchangeCurrency, setIsExchangeCurrency] = useState<boolean>(false);
    const [isTransfer, setIsTransfer] = useState<boolean>(false);

  return (<>
   <header className='header'>
    <ul className='ul-list'>
        <div className='liAndIcon firstLiIcon'>    
            <img onClick={() => setIsDashBoard(true)} src={Home} alt="" />
            <li onClick={() => setIsDashBoard(true)}>Dashboard</li>
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


    <DashBoard open={isDashBoard} isClose={() => setIsDashBoard(!isDashBoard)}>
        <div className='dashBoardOptions'>
            
            <div className='transfer-option' onClick={() => setIsExchangeCurrency(true)}>
                <p>Exchange currency</p>
            </div> 

            <div className='transfer-option' onClick={() => setIsTransfer(true)}>
                <p>Transfers</p>
            </div> 

            <div className='transfer-option'>
                <p>Utilities, telephony, internet and TV</p>
            </div> 

            <div className='transfer-option'>
                <p>Other</p>
            </div> 

        </div>
    </DashBoard>

    <ExchangeCurrency open={isExchangeCurrency} isClose={() => setIsExchangeCurrency(false)}>
        <div className=''>
            <h1>DashBoard Exchange</h1>
        </div>
    </ExchangeCurrency>

    <Transfer open={isTransfer} isClose={() => setIsTransfer(false)}>
        <h1>DashBoard Transfer</h1>
    </Transfer>
  
   </header>
  </>
  )
}

export default Header
