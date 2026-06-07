import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "../firebase";

const AuthContext = createContext();
const SESSION_KEY = "user_session";

const waitForFirebaseAuth = () =>
  new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      unsubscribe();
      resolve(firebaseUser);
    });
  });

const getSavedSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedSession);
  const [checkingSession, setCheckingSession] = useState(true);

  const login = (data) => {
    const session = {
      ...data,
      status: data.status || "active",
      loggedInAt: Date.now(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  };

  const logout = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);

    if (auth.currentUser) {
      await signOut(auth);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      const session = getSavedSession();
      const firebaseUser = await waitForFirebaseAuth();

      if (!session) {
        setCheckingSession(false);
        return;
      }

      if (session.status !== "active") {
        await logout();
        setCheckingSession(false);
        return;
      }

      if (session.isRoot && !firebaseUser && session.loginType === "root-local") {
        await logout();
        setCheckingSession(false);
        return;
      }

      if (session.isRoot || !session.id) {
        setUser(session);
        setCheckingSession(false);
        return;
      }

      try {
        const userSnapshot = await get(ref(db, `users/${session.id}`));
        const userData = userSnapshot.val();

        if (userData && userData.status !== "active") {
          await logout();
        } else {
          setUser({
            ...session,
            ...userData,
            id: session.id,
            status: userData?.status || session.status,
          });
        }
      } catch {
        setUser(session);
      }

      setCheckingSession(false);
    };

    verifySession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, checkingSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
