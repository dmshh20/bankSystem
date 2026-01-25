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
import { Link } from 'react-router-dom'
import axios from 'axios'

const Header = () => {
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [cardNumbers, setCardNumbers] = useState<string[]>(['', '', '', ''])
  const [isDashBoard, setIsDashBoard] = useState(false)
  const [isExchangeCurrency, setIsExchangeCurrency] = useState(false)
  const [isTransfer, setIsTransfer] = useState(false)

  const inputsRef = useRef<HTMLInputElement[]>([])


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value

    // digits only
    if (!/^\d*$/.test(value)) return

    const updated = [...cardNumbers]
    updated[index] = value
    setCardNumbers(updated)

    // move focus forward
    if (value.length === 4 && index < 3) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !cardNumbers[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }


  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(',', '.')

    // digits + one dot + 2 decimals
    if (!/^\d*\.?\d{0,2}$/.test(value)) return

    setAmount(value)
  }


  const handleTransfer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fullCardNumber = cardNumbers.join('')

    if (fullCardNumber.length !== 16) {
      alert('Enter full card number')
      return
    }

    if (!amount || Number(amount) <= 0) {
      alert('Enter valid amount')
      return
    }

    console.log('CARD:', fullCardNumber)
    console.log('AMOUNT:', amount)

    setCardNumbers(['', '', '', ''])
    setAmount('')
    inputsRef.current[0]?.focus()

    const body = {
      fullCardNumber,
      amount
    }
    
    console.log('check token', token);
    
    if (!token) {
      throw new Error('token is invalid')
    }
    const response = await axios.post(import.meta.env.VITE_TRANSFER, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      }
    })

    console.log(response.data);
    return response.data
  }

  const handlePaste = (e: any) => {
  e.preventDefault()

  const pastedData = e.clipboardData
    .getData('text')
    .replace(/\D/g, '') // only digits

  if (!pastedData) return

  const chunks = pastedData.match(/.{1,4}/g)?.slice(0, 4) || []

      setCardNumbers((prev) => {
        const updated = [...prev]

        chunks.forEach((chunk: any, i: any) => {
          updated[i] = chunk
        })

        return updated
      })

      // focus last filled input
      const lastIndex = chunks.length - 1
      if (inputsRef.current[lastIndex]) {
        inputsRef.current[lastIndex].focus()
      }
    }


  return (
    <>
      <header className="header">
        <ul className="ul-list">
          <div className="liAndIcon firstLiIcon">
            <img onClick={() => setIsDashBoard(true)} src={Home} alt="" />
            <li onClick={() => setIsDashBoard(true)}>Dashboard</li>
          </div>

          <div className="liAndIcon">
            <img src={Document} alt="" />
            <li>Documents</li>
          </div>

          <div className="liAndIcon">
            <img src={Payment} alt="" />
            <li>Payments</li>
          </div>

          <div className="liAndIcon">
            <img src={Calendar} alt="" />
            <li>Calendar</li>
          </div>

          <div className="liAndIcon">
            <img src={Profile} alt="" />
            <li>Profile</li>
          </div>

          <hr className="hrLine" />

          <div className="liAndIcon">
            <img src={Toggle} alt="" />
            <li>Darkmode</li>
          </div>

          <div className="liAndIcon">
            <img src={Setting} alt="" />
            <li>Settings</li>
          </div>

          <div className="liAndIcon">
            <Link to="/logout" className="liAndIconLink">
              <img src={Logout} alt="" />
              <li>Logout</li>
            </Link>
          </div>
        </ul>

        <DashBoard open={isDashBoard} isClose={() => setIsDashBoard(false)}>
          <div className="dashBoardOptions">
            <div
              className="transfer-option"
              onClick={() => setIsExchangeCurrency(true)}
            >
              <p>Exchange currency</p>
            </div>

            <div
              className="transfer-option"
              onClick={() => setIsTransfer(true)}
            >
              <p>Transfers</p>
            </div>

            <div className="transfer-option">
              <p>Utilities, telephony, internet and TV</p>
            </div>

            <div className="transfer-option">
              <p>Other</p>
            </div>
          </div>
        </DashBoard>

        <ExchangeCurrency
          open={isExchangeCurrency}
          isClose={() => setIsExchangeCurrency(false)}
        >
          <h1>DashBoard Exchange</h1>
        </ExchangeCurrency>

      <Transfer open={isTransfer} isClose={() => setIsTransfer(false)}>
        <form className="TransferForm" onSubmit={handleTransfer}>
          <div className="transferForWho">
            <h1>For the card number</h1>

            <div className="card-inputs">
              {[...Array(4)].map((_, index) => (
               <input
                  key={index}
                  type="text"
                  maxLength={4}
                  className="card-input"
                  value={cardNumbers[index]}
                  ref={(el) => {
                    if (el) inputsRef.current[index] = el
                  }}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
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

            <button className="transferBtn">Transfer</button>
          </div>
        </form>
      </Transfer>

      </header>
    </>
  )
}

export default Header
