import app from "./firebase";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";

const base = import.meta.env.VITE_API_BASE_URL;
export const hello_api = `${base}/hello`;
export const signup_api = `${base}/singup`;
export const getprofile_api = `${base}/getprofile`
export const getclasses_api = `${base}/getClasses`

export const signUp = async (name, email, password) => {
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
      body: JSON.stringify({ name, email }),
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

export const getClasses = async (idToken) => {
  try {
    const response = await fetch(getclasses_api, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Signup error:", error.message);
  }
}

export const addClass = async (className, isActive) => {
  const response = await fetch(`${base}/createClass`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: className, active: isActive }),
    });
  const data = await response.json();
  return data;
}

export const getAllStudents = async (idToken) => {
  try {
    const response = await fetch(`${base}/getAllStudents`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching students:", error.message);
  }
};

export const addStudentToClass = async (classId, studentId) => {
  const response = await fetch(`${base}/assignStudentToClass/${classId}/${studentId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    }});
  const data = await response.json();
  return data;
}

export const getStudentClassProgress = async (classId, idToken) => {
  try {
    const response = await fetch(`${base}/getStudentClassProgress/${classId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Server error: ${response.status} - ${text}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching student class progress:", error.message);
  }
};