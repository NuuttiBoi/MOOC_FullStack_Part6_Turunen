import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote } from '../service/requests'
import {updateAnecdote} from "../service/requests.js";
import {useContext} from "react";
import useNotify from "./useNotify.js"


export const useAnecdotes = () => {
    const queryClient = useQueryClient()
    const notification = useNotify()

    const result = useQuery({
        queryKey: ['anecdotes'],
        queryFn: getAnecdotes,
        retry: false
    })

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            notification(`you created '${newAnecdote.content}'`)
        },
        onError: () => {
            notification('the anecdote must be at least 5 characters long')
        }
    })

    const updateAnecdoteMutation = useMutation({
        mutationFn: updateAnecdote,
        onSuccess: (updatedAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            notification(`you voted '${updatedAnecdote.content}'`)
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