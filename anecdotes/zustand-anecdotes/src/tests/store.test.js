import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

vi.mock('../services/anecdotes', () => ({
    default: {
        getAll: vi.fn(),
        createNew: vi.fn(),
        update: vi.fn(),
    }
}))

import anecdoteService from '../services/anecdotes.js'
import useAnecdoteStore, { useAnecdotes, useFilter, useAnecdoteActions } from '../store.js'

beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes: [], filter: '' })
    vi.clearAllMocks()
})

describe('useAnecdoteActions', () => {
    it('initialize loads the anecdotes from service', async () => {
        const mockAnecdotes = [{ id: 1, content: 'Test', votes: 0 }]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.initialize()
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual(mockAnecdotes)
    })

    it('component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
        const mockAnecdotes = [
            { id: 1, content: 'Test', votes: 0 },
            { id: 2, content: 'Test2', votes: 2 },
            { id: 3, content: 'Test3', votes: 3 },
        ]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.initialize()
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual([
            { id: 3, content: 'Test3', votes: 3 },
            { id: 2, content: 'Test2', votes: 2 },
            { id: 1, content: 'Test', votes: 0 },
        ])
    })

    it('verifies the correct React component receives a properly filtered list of anecdotes', async () => {
        useAnecdoteStore.setState({
            anecdotes: [
                { id: 1, content: 'yyyyy test', votes: 0 },
                { id: 2, content: 'bbbbbbb test', votes: 0 },
                { id: 3, content: 'xxxxxx test', votes: 0 },
                { id: 4, content: 'find this!', votes: 0 },
            ],
            filter: 'find',
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual([{ id: 4, content: 'find this!', votes: 0 }])
    })

    it('voting increases the number of votes for an anecdote', async () => {
        const anecdote = { id: 1, content: 'Test', votes: 0 }
        useAnecdoteStore.setState({ anecdotes: [anecdote] })
        anecdoteService.update.mockResolvedValue({ ...anecdote, votes: anecdote.votes + 1})
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.addVote(1)
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current[0].votes === 1).toBe(true)
    })

})