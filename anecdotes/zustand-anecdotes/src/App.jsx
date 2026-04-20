import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteFilter from "./components/AnecdoteFilter.jsx";
import {useEffect} from "react";
import {useAnecdoteActions} from "./store.js";
import Notification from "./components/Notification.jsx";

const App = () => {
    const { initialize } = useAnecdoteActions()

    useEffect(() => {
        initialize()
    }, [initialize])

    return (
        <div>
            <h2>Anecdotes</h2>
            <AnecdoteFilter/>
            <Notification/>
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    )
}

export default App