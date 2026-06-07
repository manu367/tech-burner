import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import {
  equalTo,
  get,
  orderByChild,
  query,
  ref,
  set,
  update,
} from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";
import { auth, db } from "../firebase";

const provider = new GoogleAuthProvider();
const ROOT_USER = {
  email: "pathakmanu6395@gmail.com",
  password: "1234",
  firebasePasswords: ["root1234", "123456", "12345678"],
  name: "Root Admin",
  role: "admin",
  status: "active",
};

const signInRootUser = async () => {
  let lastError = null;

  for (const password of ROOT_USER.firebasePasswords) {
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        ROOT_USER.email,
        password
      );
      return result.user;
    } catch (error) {
      lastError = error;
    }
  }

  if (
    lastError?.code === "auth/user-not-found" ||
    lastError?.code === "auth/invalid-credential"
  ) {
    const result = await createUserWithEmailAndPassword(
      auth,
      ROOT_USER.email,
      ROOT_USER.firebasePasswords[0]
    );
    return result.user;
  }

  throw lastError;
};

const findUserByEmail = async (email) => {
  const emailValue = email.trim().toLowerCase();
  const usersRef = ref(db, "users");

  const byUserEmail = await get(
    query(usersRef, orderByChild("useremail"), equalTo(emailValue))
  );

  if (byUserEmail.exists()) {
    const [id, data] = Object.entries(byUserEmail.val())[0];
    return { id, ...data };
  }

  const byEmail = await get(
    query(usersRef, orderByChild("email"), equalTo(emailValue))
  );

  if (byEmail.exists()) {
    const [id, data] = Object.entries(byEmail.val())[0];
    return { id, ...data };
  }

  return null;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { setLoading } = useLoader();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const goAfterLogin = (user) => {
    const from = location.state?.from?.pathname;

    if (from && from !== "/login") {
      navigate(from, { replace: true });
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const loginEmail = form.email.trim().toLowerCase();

      if (
        loginEmail === ROOT_USER.email &&
        form.password === ROOT_USER.password
      ) {
        let rootAuthUser = null;

        try {
          rootAuthUser = await signInRootUser();
        } catch (authError) {
          if (authError.code === "auth/operation-not-allowed") {
            setError("Firebase Authentication me Email/Password provider enable karo.");
            return;
          } else {
            throw authError;
          }
        }

        const rootData = {
          name: ROOT_USER.name,
          email: ROOT_USER.email,
          useremail: ROOT_USER.email,
          role: ROOT_USER.role,
          status: ROOT_USER.status,
          loginType: "root",
          updatedAt: Date.now(),
        };

        const session = {
          id: rootAuthUser.uid,
          isRoot: true,
          ...rootData,
        };

        login(session);
        goAfterLogin(session);
        return;
      }

      const userData = await findUserByEmail(form.email);

      if (!userData || userData.password !== form.password) {
        setError("Invalid email or password");
        return;
      }

      if (userData.status !== "active") {
        setError("Your account is inactive");
        return;
      }

      const session = {
        id: userData.id,
        name: userData.name || userData.username || "",
        email: userData.email || userData.useremail || form.email,
        role: userData.role || "user",
        status: userData.status,
        loginType: "manual",
      };

      login(session);
      goAfterLogin(session);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;
      const userRef = ref(db, `users/${googleUser.uid}`);
      const userSnapshot = await get(userRef);

      const existing = userSnapshot.val();

      if (existing?.status === "inactive") {
        setError("Your account is inactive");
        return;
      }

      const userData = {
        name: googleUser.displayName || existing?.name || "",
        email: googleUser.email,
        useremail: googleUser.email,
        photoURL: googleUser.photoURL || "",
        role: existing?.role || "user",
        status: existing?.status || "active",
        loginType: "google",
        updatedAt: Date.now(),
      };

      if (existing) {
        await update(userRef, userData);
      } else {
        await set(userRef, {
          ...userData,
          createdAt: Date.now(),
        });
      }

      const session = {
        id: googleUser.uid,
        ...userData,
      };

      login(session);
      goAfterLogin(session);
    } catch (err) {
      setError(err.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-slate-800 p-6 rounded-2xl shadow-xl text-white"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-400 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="w-full bg-blue-500 py-3 rounded-lg font-bold">
          Login
        </button>

        <div className="flex items-center gap-3 my-5 text-slate-400">
          <span className="h-px flex-1 bg-slate-600" />
          <span className="text-sm">or</span>
          <span className="h-px flex-1 bg-slate-600" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-white text-slate-800 py-3 rounded-lg font-bold"
        >
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default Login;
