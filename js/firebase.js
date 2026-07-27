import { initializeApp } from 
"https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";



const firebaseConfig = {

    apiKey: "AIzaSyBcNfmknA7wt5t3QQZacFNHkGfC_GVtfmo",

    authDomain: "controle-sdr-bd3e4.firebaseapp.com",

    projectId: "controle-sdr-bd3e4",

    storageBucket: "controle-sdr-bd3e4.firebasestorage.app",

    messagingSenderId: "654783912396",

    appId: "1:654783912396:web:2127a52de281cf88aaa569"

};



const app = initializeApp(firebaseConfig);



const db = getFirestore(app);


const auth = getAuth(app);



export { db, auth };