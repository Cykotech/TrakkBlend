import './Searchbar.css'

function Searchbar() {
    return (
        <>
            <form>
                <input className='song-name' type='text' placeholder='Find a song'></input>
                <input className='search' type='submit' value='Search'></input>
            </form>
        </>
    )
}

export default Searchbar;