import { useContext } from 'react'
import NotificationContext from '../NotificationContext.jsx'

const useNotify = () => {
    const { showNotification } = useContext(NotificationContext)
    return showNotification
}
export default useNotify