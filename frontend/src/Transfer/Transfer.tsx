import type { ReactNode } from "react"
import DashBoard from "../Dashboard/DashBoard"

interface TranferType {
    open: boolean
    isClose: () => void
    children: ReactNode
}

const Transfer = ({open, isClose, children}: TranferType) => {
  return (
    <DashBoard open={open} isClose={isClose}>
        {children}
    </DashBoard>

    )
}

export default Transfer
