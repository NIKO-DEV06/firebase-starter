import { useEffect, useState } from "react";
import "./App.css";
import Auth from "./components/Auth";
import { db, auth, storage } from "./config/firebase-config";
import {
  // getDocs, // will get the docs but updates will not be real-time
  onSnapshot,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

function App() {
  const [movieList, setMovieList] = useState([]);

  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [newMovieHasOscar, setNewMovieHasOscar] = useState(false);

  const [updateTitle, setUpdateTitle] = useState("");

  const [fileUpload, setFileUpload] = useState(null);

  const moviesCollection = collection(db, "movies");

  const getMovieList = async () => {
    // READ THE DATA
    try {
      onSnapshot(moviesCollection, (snapshot) => {
        const updatedData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMovieList(updatedData);
      });
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
        userId: auth?.currentUser?.uid,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await deleteDoc(movieDoc);
    } catch (error) {
      console.log(error);
    }
  };

  const updateMovieTitle = async (id) => {
    try {
      const movieDoc = doc(db, "movies", id);
      await updateDoc(movieDoc, { title: updateTitle });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadFileHandler = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
      console.log("File Uploaded Succesfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center flex-col pb-[1rem]">
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
            <div>
              <h1
                className={`text-4xl font-semibold uppercase ${
                  movie.hasOscar ? "text-green-500" : "text-red-500"
                }`}
              >
                --{movie.title}
              </h1>
              <p className="text-lg">Release Date:{movie.releaseDate}</p>
            </div>
            <button
              onClick={() => deleteMovie(movie.id)}
              className="border-2 border-black bg-red-300 hover:bg-red-200 duration-200 p-2 text-black rounded-lg"
            >
              Delete Movie
            </button>
            <input
              type="text"
              className="border-2 border-black p-2 ml-2"
              placeholder="New Movie Title..."
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <button
              onClick={() => updateMovieTitle(movie.id)}
              className="border-2 ml-2 border-black bg-blue-300 hover:bg-blue-200 duration-200 p-2 text-black rounded-lg"
            >
              Update Title
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 justify-center items-center pb-10 mt-5">
        <input
          type="file"
          id="fileInput"
          onChange={(e) => setFileUpload(e.target.files[0])}
        />
        <button
          onClick={uploadFileHandler}
          className="border-2 ml-2 border-black bg-purple-300 hover:bg-purple-200 duration-200 p-2 text-black rounded-lg"
        >
          Upload File
        </button>
      </div>
    </>
  );
}

export default App;
