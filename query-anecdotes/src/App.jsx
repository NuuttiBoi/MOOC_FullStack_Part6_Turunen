import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useAnecdotes} from "./hooks/useAnecdotes.js";
const App = () => {
  const {anecdotes, isPending, isError, addAnecdote, handleVote } = useAnecdotes()

  if (isPending) {
    return <div>loading data...</div>
  }
  if (isError) {
    return <div>error loading anecdote data from the server</div>
  }
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote} />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App