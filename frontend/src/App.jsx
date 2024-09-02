import React, { useEffect } from 'react'
import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

import Routes from './Routes.jsx'
import './App.css'

function App() {

  async function saveToken(token) {
    try {
      const response = await fetch('http://localhost:3000/api/save-fcm/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('Token saved successfully:', result);
      } else {
        console.error('Error saving token:', result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  }

  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const token = await getToken(messaging, {
        vapidKey:
          "BPdoe60dX2yY1-gcZ271OI8VT4aV6yNnXPTUzjdsIyw_eB3LGXuu08i2T31NSZM719drUtFbhagZ1YjuRt-P_k0",
      });
      console.log("Token Gen", token);
      saveToken(token)

    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);

  return (
    <>
      <Routes />
    </>
  )
}

export default App
