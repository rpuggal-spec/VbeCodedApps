import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import LogoutButton from "../components/LogoutButton";

export default function Dashboard() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    api
      .get("/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage("Unauthorized"));
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-20 text-center space-y-4">
      <h2 className="text-2xl font-bold">{message}</h2>
      <LogoutButton />
    </div>
  );
}
