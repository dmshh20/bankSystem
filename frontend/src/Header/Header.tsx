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
import { useRef, useState } from 'react'
import ExchangeCurrency from '../ExchangeCurrency/ExchangeCurrency'
import Transfer from '../Transfer/Transfer'

const Header = () => {
    const [amount, setAmount] = useState('')
    const [isDashBoard, setIsDashBoard] = useState<boolean>(false)
    const [isExchangeCurrency, setIsExchangeCurrency] = useState<boolean>(false);
    const [isTransfer, setIsTransfer] = useState<boolean>(false);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(',', '.')

        // Allow only digits and one dot
        if (!/^\d*\.?\d{0,2}$/.test(value)) return

        setAmount(value)
        }

        
    const inputsRef = useRef<HTMLInputElement[]>([])
    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
    ) => {
    const value = e.target.value

    // digits only
    if (!/^\d*$/.test(value)) return

    // auto move forward
    if (value.length === 4 && index < 3) {
        inputsRef.current[index + 1]?.focus()
    }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !inputsRef.current[index].value && index > 0) {
            inputsRef.current[index - 1]?.focus()
        }
    }



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
            <Link to='/logout' className='liAndIconLink'>
            <img src={Logout} alt="" />
                <li >Logout</li>
            </Link>
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
        <div className="TransferForm">
            <div className="transferForWho">
            <h1>For the card number</h1>

            <div className="card-inputs">
                {[...Array(4)].map((_, index) => (
                    <input
                    key={index}
                    type="text"
                    maxLength={4}
                    className="card-input"
                    ref={(el) => {
                        if (el) inputsRef.current[index] = el
                    }}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    placeholder="- - - -"
                    />
                ))}
                </div>
                <div className="amount-wrapper">
                    <input
                        type="text"
                        className="amount-input"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        inputMode="decimal"
                    />
                    <span className="currency">₴</span>
                </div>

                <button className='transferBtn'>Transfer</button>
            </div>
        </div>
        </Transfer>

  
   </header>
  </>
  )
}

export default Header
