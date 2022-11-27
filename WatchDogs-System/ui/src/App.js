import io from "socket.io-client";
import { useState, useEffect } from "react";
function App() {
  const [performanceData, setPerformanceData] = useState({});
  const [keys, setKeys] = useState([]);

  useEffect(() => {

    // 
    async function getAuthToken()
    {
      try {

        // Add proxy and make a get request with sending the clientType object
        // Client has to be either [UI] or [dog] to recieve respective token
        let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiMFVremlIS1F1SmNxcmVYIiwiaWF0IjoxNjY5MzA3NTc1LCJleHAiOjE2NjkzMTExNzV9.cILqbJfTkrAWbfRVkzltL4Ab5SjNvaHHboy5ZgPKvDs";
        
        const socket = io.connect("http://103.83.137.87");
        socket.emit('clientAuth', token);

        // CPU info.
        socket.on("data", (data) => {
      
          console.log(data);
    
        });

      } catch (error) {
        console.log(error);
      }
    }
    getAuthToken();

  }, []);
  return (
    <>
      <h1>
        CS Project
      </h1>
    </>
  );
}

export default App;
