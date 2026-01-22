import { useNavigate } from 'react-router-dom'
import './Logout.css'

const Logout = () => {
  const navigate = useNavigate()

  const handleYes = () => {
    navigate('/signin')
    localStorage.removeItem('accessToken')
  }

  const handleStay = () => {
    navigate('/') 
  }

  return (
    <div className="logout-page">
      <div className="logout-card">
        <h2 className="logout-title">Are you sure you want to leave?</h2>
        <div className="logout-buttons">
          <button className="btn-yes" onClick={handleYes}>
            Yes
          </button>
          <button className="btn-stay" onClick={handleStay}>
            Stay
          </button>
        </div>
      </div>
    </div>
  )
}

export default Logout
