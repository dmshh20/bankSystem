import './Home.css'
import stroke11 from '../images/Stroke 11.png'
import stroke12 from '../images/Stroke 12.png'
import stroke3 from '../images/Stroke-3.png'
import stroke1 from '../images/Stroke-1.png'
import notification from '../images/Notification.png'
import notification2 from '../images/notification2.png'

const Home = () => {
  return (
    <>
        <div className='homePage'>

        <div className='SearchMessageNotification'>

            <div className='tapSearch'>
                <div className='searchImages'>
                    <img src={stroke11} alt="" />
                    <img src={stroke12} alt="" />
                </div>
                <p className='searchLine'>Tap here to search</p>
            </div>

            {/* <div className='message'>
                <img src={stroke3} className='stroke3' alt="" />
                <img src={stroke1} className='stroke1' alt="" />
            </div> */}

            <div className='notification'>
                <img src={notification} className='notification1'  alt="" />
                
            </div>

        </div>

        <div className='finance'>
            <div className='totalFinance'>
                <h1 className='totalFinaceStr'>Total Finance</h1>
                <p className='totalFinaceCount'>9,900k</p>
            </div>

            <div className='totalExpense'>
                <div className='totalExpenseStr'>Total Expense</div>
                <div className='totalFinaceCount'>8,240k</div>
            </div>
        </div>

        <div className='lastOperations'>
            <h1 className='lastOperationsMessage'>Recent transactions</h1>
        </div>

        </div>
    </>
  )
}

export default Home
