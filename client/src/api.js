import app from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const base = import.meta.env.VITE_API_BASE_URL;
export const hello_api = `${base}/hello`;
export const signup_api = `${base}/singup`;
export const getprofile_api = `${base}/getprofile`

export const signUp = async (email, password) => {
  const auth = getAuth(app);
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();
    const response = await fetch(getprofile_api, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return { token: idToken, userData: data };

  } catch (error) {
    console.error("Signup error:", error.message);
  }
}

export const login = async (email, password) => {
  const auth = getAuth(app);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();
  
  const response = await fetch(getprofile_api, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

  const data = await response.json();
  return { token: idToken, userData: data };
}

export const profile = async (idToken) => {
  if (!idToken) {
    // throw error
  }
    const response = await fetch(`${base}/profile`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
    }
  });

  const data = await response.json();
  return data;
}