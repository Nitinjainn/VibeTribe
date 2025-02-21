import React, { useEffect, useState } from "react";
import axios from "axios";

function TokenBalance() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from backend API
    axios.get("http://localhost:5000/api/vitalik-balance")
      .then(response => {
        setBalance(response.data.balance);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Vitalik's USDC Balance: {balance}</h2>
    </div>
  );
}

export default TokenBalance;
