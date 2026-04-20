import {createContext, useState} from 'react'

const NotificationContext = createContext()

export default NotificationContext
export const NotificationContextProvider = (props) => {
    const [notificationMessage, setNotificationMessage] = useState(null)
    const showNotification = (notificationText) => {
        setNotificationMessage(notificationText)

        setTimeout(() => {
            setNotificationMessage(null)
        }, 5000)
    }

    return (
        <NotificationContext.Provider value={{ notificationMessage, showNotification }}>
            {props.children}
        </NotificationContext.Provider>
    )
}