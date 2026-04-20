import { useAnecdoteActions } from '../store'

const AnecdoteFilter = () => {
    const { setFilter } = useAnecdoteActions()
    const handleChange = (e) => {
        e.preventDefault()
        setFilter(e.target.value)
    }
    const style = {
        marginBottom: 10
    }
    return (
        <div style={style}>
            filter
            <input
                type="text"
                name="filter"
                onChange={handleChange}
            />
        </div>
    )
}

export default AnecdoteFilter