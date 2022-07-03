// import firebase from 'firebase/app';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

var firebaseConfig = {
  apiKey: "AIzaSyArEbM73M9ndVXpdIXq_tagaq32rTX3EnY",
  authDomain: "bookcare-d7152.firebaseapp.com",
  projectId: "bookcare-d7152",
  storageBucket: "bookcare-d7152.appspot.com",
  messagingSenderId: "617822358232",
  appId: "1:617822358232:web:6a2061b2cfd189878e65ad",
  measurementId: "G-RGC7LP9CRS"
};

// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// export const getToken = (setTokenFound) => {
//   return messaging.getToken({vapidKey: 'BIjTRuzMNli0VQs2e4u8Uyw5o64R0zqQ9wXkMa2J92GhQqlMP_48CMyA6QEeZF76fh0T2CiaFbLYQS8qz5hwsRM'}).then((currentToken) => {
//     if (currentToken) {
//       console.log('current token for client: ', currentToken);
//       setTokenFound(true);
//       // Track the token -> client mapping, by sending to backend server
//       // show on the UI that permission is secured
//     } else {
//       console.log('No registration token available. Request permission to generate one.');
//       setTokenFound(false);
//       // shows on the UI that permission is required 
//     }
//   }).catch((err) => {
//     console.log('An error occurred while retrieving token. ', err);
//     // catch error while creating client token
//   });
// }

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     messaging.onMessage((payload) => {
//       resolve(payload);
//     });
// });



firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// const { "REACT_APP_VAPID_KEY" } = process.env;
const publicKey = "BIjTRuzMNli0VQs2e4u8Uyw5o64R0zqQ9wXkMa2J92GhQqlMP_48CMyA6QEeZF76fh0T2CiaFbLYQS8qz5hwsRM";

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });




// import firebase from 'firebase/compat/app'
// import 'firebase/compat/messaging'
// var firebaseConfig = {
//   apiKey: "AIzaSyArEbM73M9ndVXpdIXq_tagaq32rTX3EnY",
//   authDomain: "bookcare-d7152.firebaseapp.com",
//   projectId: "bookcare-d7152",
//   storageBucket: "bookcare-d7152.appspot.com",
//   messagingSenderId: "617822358232",
//   appId: "1:617822358232:web:6a2061b2cfd189878e65ad",
//   measurementId: "G-RGC7LP9CRS"
// };

// firebase.initializeApp(firebaseConfig);

export default firebase