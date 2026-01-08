import type { ReactNode } from "react"
import './DashBoard.css'

interface DashBoardType {
  children: ReactNode
  open: boolean
  isClose: () => void
}

const DashBoard = ({children, open, isClose}: DashBoardType) => {
  if (!open) return null

  return (
    <div className="backgroundDisplay" onClick={isClose}>
      <div onClick={(e) => {e.stopPropagation()}} className="insideModal">
            <i className="fa-solid fa-xmark" onClick={(e) => {e.stopPropagation(); isClose()}}></i>
        {children}
      </div>
    </div>
  )
}

export default DashBoard
