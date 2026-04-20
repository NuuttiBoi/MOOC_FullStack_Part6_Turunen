import { useAnecdoteActions } from '../store'
import anecdoteService from '../services/anecdotes.js'


const AnecdoteForm =  () => {
    const {add} = useAnecdoteActions()
    const generateId = () => Number((Math.random() * 1000000).toFixed(0))

    const addAnecdote = async (e) => {
        e.preventDefault()
        const content = e.target.anecdote.value
        await add(content)
        /*
        add({
            id: generateId(), content, votes: 0
        })

         */
        e.target.reset()
    }



    return (
        <form onSubmit={addAnecdote}>
            <input name="anecdote"/>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm