import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth";

function SignOut({onSignOut = () => {}}) {
  const navigate = useNavigate();
  useEffect(() => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      onSignOut();
      navigate("/");
    })
    .catch((error) => {
      console.error("Error signing out:", error);
    });
}, [navigate, onSignOut]);
  return <></>
}

export default SignOut;