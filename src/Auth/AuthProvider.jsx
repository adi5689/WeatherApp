import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import your Firebase auth and db instances
import { doc, setDoc, updateDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  console.log(currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, save their profile to Firestore
        await saveUserProfileToFirestore(user);
        // Update the user's status to 'active'
        await updateUserStatus(user.uid, 'active');
      } else {
        // User is signed out, update the user's status to 'inactive'
        if (currentUser) {
          await updateUserStatus(currentUser.uid, 'inactive');
        }
      }
    });

    return unsubscribe;
  }, [currentUser]);

  const saveUserProfileToFirestore = async (user) => {
    const userId = user.uid;
    const userProfile = {
      email: user.email,
      createdAt: user.metadata.creationTime, // Save the creation time
      status: 'active', // Set the initial status to 'active'
      // Add any additional user profile information here
    };

    try {
      await setDoc(doc(db, 'weatherapp_users', userId), userProfile, { merge: true });
      console.log(`User profile saved successfully for user ${userId}`);
    } catch (error) {
      console.error("Error saving user profile to Firestore: ", error);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await updateDoc(doc(db, 'weatherapp_users', userId), { status });
      console.log(`User status updated to '${status}' for user ${userId}`);
    } catch (error) {
      console.error("Error updating user status in Firestore: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
