import type { ReactNode } from "react"
import DashBoard from "../Dashboard/DashBoard"


interface ExchangeCurrencyType {
    open: boolean
    isClose: () => void
    children?: ReactNode
}

const ExchangeCurrency = ({open, isClose, children}: ExchangeCurrencyType) => {
  return (
    <DashBoard open={open} isClose={isClose}>
        {children}
    </DashBoard>
  )
}

export default ExchangeCurrency
