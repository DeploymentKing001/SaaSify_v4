importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyB89nIW7OOsUmfYaxsnbe-zSmH93f6sLlI",
  authDomain: "saasify-aa525.firebaseapp.com",
  projectId: "saasify-aa525",
  storageBucket: "saasify-aa525.appspot.com",
  messagingSenderId: "850520142818",
  appId: "1:850520142818:web:1d15b5c380da3292a0ffbb",
  measurementId: "G-L9JWWVYZJK"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
