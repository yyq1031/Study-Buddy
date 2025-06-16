import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

function SignOut() {
  const navigate = useNavigate();
  useEffect(() => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate("/");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}, [navigate]);
  return <></>
}

export default SignOut;