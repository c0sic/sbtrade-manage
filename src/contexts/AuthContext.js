import React, { useContext, useState, useEffect } from "react";
import { firestore, auth } from "../firebase";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [isOrg, setIsOrg] = useState(null);

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    setIsOrg(null);
    return auth.signOut();
  }

  useEffect(() => {
    const fetchLoginType = async (user) => {
      try {
        const userDoc = await firestore.collection("users").doc(user.uid).get();
        if (userDoc.exists) {
          setIsOrg(userDoc.data().isOrg);
        } else {
          setIsOrg(null);
        }
      } catch (error) {
        console.error("Error fetching: ", error);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user != null) {
        fetchLoginType(user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isOrg,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
