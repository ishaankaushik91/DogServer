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
        let token = axios.get();
        
        const socket = io.connect("http://localhost:8000");
        socket.emit('clientAuth', token);

        // CPU info.
        socket.on("data", (data) => {
      
          setPerformanceData(data);
          setKeys(Object.keys(data));
    
        });

      } catch (error) {
        console.log(error);
      }
    }
    getAuthToken();

  }, []);
  return (
    <>
      {keys.map((ele, index) => {
        return 
        <p keys={index}>
          ele : {performanceData.ele}
        </p>
      })}
    </>
  );
}

export default App;
