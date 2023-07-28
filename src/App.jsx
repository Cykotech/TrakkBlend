import './App.css'
import Searchbar from './Searchbar/Searchbar'
import Results from './Results/Results'
import Playlists from './Playlists/Playlists/'


function App() {
  const testResults = [
    {
      image: "./src/assets/The_Weeknd_-_After_Hours.png",
      artist: "The Weeknd",
      title: "Blinding Lights",
      id: 1,
    }, 
    {
      image: "./src/assets/Thepoison.jpg",
      artist: "Bullet for My Valentine",
      title: "Tears Don't Fall",
      id: 2,
    }
  ];
  const testPlaylist = [
    {
      image: "./src/assets/Thepoison.jpg",
      artist: "Bullet for My Valentine",
      title: "Tears Don't Fall",
      id: 1
    }
  ]

  return (
    <>
     <div className='header'>
      <h1>Tra<span className="red">kk</span>Blend</h1>
     </div>
     <Searchbar />
     <div className='editor'>
      <Results results={testResults} />
      <Playlists playlist={testPlaylist}/>
     </div>
    </>
  )
}

export default App
