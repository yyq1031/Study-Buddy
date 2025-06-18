import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

function SignOut({onSignOut = () => {}, setUser }) {
  const navigate = useNavigate();
  useEffect(() => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser?.(null);
      onSignOut();
      navigate("/");
      window.location.reload(); 
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}, [navigate, onSignOut, setUser]);
  return <></>
}

export default SignOut;