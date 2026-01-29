import './Home.css'
import notification from '../images/Notification.png'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface Transaction {
    id: number;
    amount: string; 
    senderId: number;
    sender: any
    receiverId: number;
    receiver: any
    currency: string
    time: string;
}

const Home = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))
    const [decryptedCard, setDecryptedCard] = useState<string>('')
    const [copied, setCopied] = useState(false)
    const [currentSum, setCurrentSum] = useState('')
    const [currentDecimal, setCurrentDecimal] = useState('')
    const [transaction, setTransaction] = useState<Transaction[]>([]) 
    const [currentUserId, setCurrentUserId] = useState<number>() 

  // mask helper
  const maskCardNumber = (card: string) => {
    if (!card) return ''
    return `**** **** **** ${card.slice(-4)}`
  }

  // fetch decrypted card
  const showCardNumber = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_DECRYPT_CARD_FOR_USER,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setDecryptedCard(String(response.data))
    } catch (err) {
      console.error('Failed to fetch card number', err)
    }
  }

  // copy handler
  const copyCardNumber = async () => {
    if (!decryptedCard) return

    try {
      await navigator.clipboard.writeText(decryptedCard)
      setCopied(true)

      setTimeout(() => setCopied(false), 2000)
    } catch (err) { 
      console.error('Copy failed', err)
    }
  }

  const userTotal = async () => {
    const response = await axios.get(import.meta.env.VITE_USER_ME, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })
    const responseBalance = response.data.existingBankAccount.balance;

    const formatFullBalance = new Intl.NumberFormat('eu-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(responseBalance)   
    const splitFormatBalance = formatFullBalance.split('.') 

    setCurrentSum(splitFormatBalance[0])
    setCurrentDecimal(splitFormatBalance[1])
  }


  const recentTransaction = async () => {
        const response = await axios.get('http://localhost:3000/auth/recent-transactions',{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    })

    
    const dataTransaction = response.data.transactions
    setTransaction(dataTransaction)
    setCurrentUserId(response.data.userId)
    console.log(response.data.transactions.sender);
    
  }


  useEffect(() => {
    showCardNumber()
    userTotal()
    recentTransaction()
  }, [])

  return (
    <div className='homePage'>
      <div className='SearchMessageNotification'>
        <div className='tapSearch'>
        
          <p
            className='decryptedCard'
            style={{ cursor: 'pointer' }}
            title='Click to copy card number'
          >
            {copied ? 'Copied!' : maskCardNumber(decryptedCard)}
          </p>
          <i onClick={copyCardNumber} className={copied ? "fa-regular fa-copy fa-copy-hidden" : "fa-regular fa-copy"}></i>
        </div>

        <div className='notification'>
          <img src={notification} className='notification1' alt='' />
        </div>
      </div>

      <div className='finance'>
        <div className='totalFinance'>
          <h1 className='totalFinaceStr'>Total Finance</h1>
         
          <p className='totalFinaceCount'>{currentSum}<b className='decimalNumber'>.{currentDecimal}</b>₴</p>
        </div>

        <div className='totalExpense'>
          <div className='totalExpenseStr'>Total Expense</div>
          <div className='totalFinaceCount'>8,240k</div>
        </div>
      </div>

      <div className='lastOperations'>
        <h1 className='lastOperationsMessage'>Recent transactions</h1>
      <div className='recentTransactionsList'>
          {transaction.slice(0, 4).map((th) => {
        const isOutgoing = currentUserId === th.senderId;
        const { firstName, surname } = isOutgoing ? th.receiver : th.sender;

        return (
          <div key={th.id} className="everyTransactionList">
            <span className='transcationList'>
              {isOutgoing ? 'To' : 'From'}: {firstName} {surname}
            </span>
            <p className={isOutgoing ? 'amount-red' : 'amount-green'}>
              {isOutgoing ? '-' : '+'}{th.amount} {th.currency}
            </p>
          </div>
        );
      })}

      </div>

      </div>
    </div>
  )
}

export default Home
