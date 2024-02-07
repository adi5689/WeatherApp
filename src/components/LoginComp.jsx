import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import your db instance from firebase.js

const LoginComp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // New state for the username
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/weather"); // Redirect to the weather app after login
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // After creating the user account, save the username to Firestore
        const usersCollection = collection(db, "users"); // Assuming you have a 'users' collection
        await addDoc(usersCollection, { uid: user.uid, username });
        
        alert("Account created successfully. Please log in.");
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("Invalid ID or Password!")
      // Handle errors here
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="mb-6 text-2xl font-semibold text-gray-700 text-center">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
        <button
          onClick={toggleForm}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-black font-semibold rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Switch to {isLogin ? "Sign Up" : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default LoginComp;
