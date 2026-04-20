import { useAnecdoteActions, useAnecdotes } from '../store'
const AnecdoteList = () => {
    const anecdotes = useAnecdotes().toSorted((a, b) => b.votes - a.votes)
    const {addVote, deleteAnecdote} = useAnecdoteActions()
    return (
        <div>
            {anecdotes.map((anecdote) => (
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => addVote(anecdote.id)}>vote</button>
                        <button onClick={() => deleteAnecdote(anecdote.id)}>delete</button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default AnecdoteList