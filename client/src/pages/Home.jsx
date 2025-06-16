import { hello_api } from "../api";
import { useEffect, useState } from "react";

function Home() {
      const [message, setMessage] = useState('');
    
      useEffect(() => {
        fetch(hello_api)
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
      }, []);
    return <h1>Hoem Page {message}</h1>
}

export default Home;