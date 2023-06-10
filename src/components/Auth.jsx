import { useState, useEffect } from "react";
import { auth, googleProvider } from "../config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null); // Track the user's authentication state

  useEffect(() => {
    // Listen for changes in the user's authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  console.log(auth?.currentUser?.email);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex flex-col mt-[2rem] gap-[0.5rem] w-[20rem]">
        <input
          className="border-2 border-black p-2"
          placeholder="Email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border-2 border-black p-2"
          placeholder="Password..."
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={signIn}
          className="border-2 border-black bg-green-300 hover:bg-green-200 duration-200 p-2 text-black rounded-lg"
        >
          Sign In
        </button>
        <button
          onClick={signInWithGoogle}
          className="border-2 border-black bg-blue-300 hover:bg-blue-200 duration-200 p-2 text-black rounded-lg"
        >
          Sign In with Google
        </button>
        {user && (
          <button
            onClick={logout}
            className="border-2 border-black bg-red-300 hover:bg-red-200 duration-200 p-2 text-black rounded-lg"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
};

export default Auth;
