import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote } from '../service/requests'
import {updateAnecdote} from "../service/requests.js";
import NotificationContext from '../NotificationContext'
import {useContext} from "react";


export const useAnecdotes = () => {
    const queryClient = useQueryClient()
    const { showNotification } = useContext(NotificationContext)

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            showNotification(`you created '${newAnecdote.content}'`)
        },
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            showNotification(`you voted '${updatedAnecdote.content}'`)
        }
    })

    return {
        anecdotes: result.data || [],
        isPending: result.isPending,
        isError: result.isError,
        addAnecdote: (content) => {newAnecdoteMutation.mutate({content, votes: 0})},
        handleVote: (anecdote) => {updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})}
    }
}