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

    it('add appends a new note', async () => {
        const newAnecdote = { id: 2, content: 'New anecdote', votes: 1 }
        anecdoteService.createNew.mockResolvedValue(newAnecdote)
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.add('New anecdote')
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toContainEqual(newAnecdote)
    })

    it('component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
        const mockAnecdotes = [
            { id: 1, content: 'Test', votes: 0 },
            { id: 1, content: 'Test2', votes: 2 },
            { id: 1, content: 'Test3', votes: 3 }
        ]
        anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
        const { result } = renderHook(() => useAnecdoteActions())
        await act(async () => {
            await result.current.initialize()
        })
        const { result: anecdotesResult } = renderHook(() => useAnecdotes())
        expect(anecdotesResult.current).toEqual(mockAnecdotes)

    })

    it('verifies the correct React component receives a properly filtered list of anecdotes', async () => {

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