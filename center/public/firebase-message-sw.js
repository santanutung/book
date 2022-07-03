

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: "AIzaSyArEbM73M9ndVXpdIXq_tagaq32rTX3EnY",
  authDomain: "bookcare-d7152.firebaseapp.com",
  projectId: "bookcare-d7152",
  storageBucket: "bookcare-d7152.appspot.com",
  messagingSenderId: "617822358232",
  appId: "1:617822358232:web:6a2061b2cfd189878e65ad",
  measurementId: "G-RGC7LP9CRS"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});


self.addEventListener('notificationclick', function (event) {
  event.waitUntil(self.clients.openWindow(event.currentTarget.dataEventJson.click_action));
  
});

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('../firebase-messaging-sw.js')
//      .then(function(registration) {
//         console.log("Service Worker Registered");
//         messaging.useServiceWorker(registration);
//      });
// }