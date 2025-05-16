import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/products")
      .then((res) => {
        console.log("API response:", res.data);  // 👈 Check response
        setData(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Dữ liệu từ backend</h1>
      <ul>
        {Array.isArray(data) ? (
          data.map((item, idx) => <li key={idx}>{item.name}</li>)
        ) : (
          <li>Dữ liệu không hợp lệ</li>
        )}
      </ul>
    </div>
  );
}

export default App;