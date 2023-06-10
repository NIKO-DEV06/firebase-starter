import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { db } from "./config/firebase-config";
import { getDocs, collection, addDoc } from "firebase/firestore";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieHasOscar, setNewMovieHasOscar] = useState(false);

  const moviesCollection = collection(db, "movies");

  const getMovieList = async () => {
    // READ THE DATA
    try {
      const data = await getDocs(moviesCollection);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollection, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        hasOscar: newMovieHasOscar,
      });
      getMovieList();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center flex-col">
        <Auth />
        <div className="flex flex-col mt-[1rem] gap-[0.5rem] justify-center items-center">
          <h1 className="font-bold">ADD MOVIE</h1>
          <input
            className="border-2 border-black p-2"
            placeholder="Movie Title.."
            onChange={(e) => setNewMovieTitle(e.target.value)}
          />
          <input
            type="number"
            className="border-2 border-black p-2"
            placeholder="Release Year..."
            onChange={(e) => setNewReleaseDate(Number(e.target.value))}
          />
          <div className="flex gap-2">
            <input
              type="checkbox"
              checked={newMovieHasOscar}
              onChange={(e) => setNewMovieHasOscar(e.target.checked)}
            />
            <label>Receive Oscar</label>
          </div>
          <button
            onClick={onSubmitMovie}
            className="border-2 border-black bg-green-300 hover:bg-green-200 duration-200 p-2 text-black rounded-lg"
          >
            Submit Movie
          </button>
        </div>

        {movieList.map((movie) => (
          <div key={movie.id} className="mt-10 text-center">
            <h1
              className={`text-4xl font-semibold uppercase ${
                movie.hasOscar ? "text-green-500" : "text-red-500"
              }`}
            >
              --{movie.title}
            </h1>
            <p className="text-lg">Release Date:{movie.releaseDate}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
