import { create } from 'zustand'
import anecdoteService from './services/anecdotes.js'
import { useMessageStore } from './notificationStore'

/*
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

 */

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = anecdote => ({
  content: anecdote,
  id: getId(),
  votes: 0
})

const useAnecdoteStore = create((set) => ({
  anecdotes: [],
  filter: 'all',
  actions: {
    addVote: async (id) => {
      const anecdote = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      const updatedAnecdote = await anecdoteService.update(id, {...anecdote, votes: anecdote.votes +1})
      set(state => ({
        anecdotes: state.anecdotes.map(a => a.id === id ? updatedAnecdote : a)
      }))
      useMessageStore.getState().actions.setNotificationMessage(`You voted '${updatedAnecdote.content}'`)
    },
    setFilter: value => set(() => ({filter: value})),
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({anecdotes: state.anecdotes.concat(newAnecdote)}))
      useMessageStore.getState().actions.setNotificationMessage(`You created a new
          anecdote: ${newAnecdote.content}`)
    },
    deleteAnecdote: async (id) => {
      const anecdoteToDelete = useAnecdoteStore.getState().anecdotes.find(a => a.id === id)
      if(anecdoteToDelete.votes <= 0){
        const deletedAnecdote = await anecdoteService.deleteAnecdote(anecdoteToDelete.id)
        set(state => ({
          anecdotes: state.anecdotes.map(a => a.id === id ? deletedAnecdote : a)
        }))
      } else {
        useMessageStore.getState().actions.setNotificationMessage('Not allowed to delete anecdote that has ' +
            'more than 0 votes')
      }

    },
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({anecdotes}))
    },
  }
}))

export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  if(filter === 'all'){
    return anecdotes
  } else {
    return anecdotes.filter(a =>
        a.content.toLowerCase().includes(filter.toLowerCase())
    )
  }
}
export default useAnecdoteStore