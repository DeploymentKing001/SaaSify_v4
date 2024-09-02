import axios from "axios";

async function checkMessageStatus(messageId) {
  const accessToken = 'EAADflsQXGB4BO6ZBqZAdpYZCUlIlQ5K1h2DDtDhha7HSib8OK2ls2p1jOa5lPztNGwNPy7suoHzN5i9CA0v69rcayKZAM9J7MldLyzeeOhcpHCaB3bDGEZCAyUitnuGaeBnaUKxOBa1linOC4Fc0QrLPzf6s05juAAGc9iXvt1ZCygF63a8DoCInYVZAinhSPFoGH6S1TtTieJ3axWZCwK4ZD'; // Replace with your access token
  const phoneNumberId = '105927482491402'; // Replace with your phone number ID

  try {
    const response = await axios.get(
      `https://graph.facebook.com/v20.0/${phoneNumberId}/messages/${messageId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );

    console.log('Message status:', response.data);
  } catch (error) {
    console.error('Error checking message status:', error.response ? error.response.data : error.message);
  }
}

// Usage
const messageId = 'wamid.HBgMOTIzMTIyMzAyMTQ2FQIAERgSOENCOEJFOTQyNjIwRTY5N0U1AA=='; // Replace with your message ID
checkMessageStatus(messageId);
