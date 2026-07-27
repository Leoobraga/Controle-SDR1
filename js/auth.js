import { auth } from "./firebase.js";


import {

    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";




// PROTEGER PÁGINA

onAuthStateChanged(auth, (usuario)=>{


    if(!usuario){


        window.location.href = "login.html";


    }


});




// BOTÃO SAIR

const btnSair = document.getElementById("btnSair");


if(btnSair){


    btnSair.addEventListener("click", ()=>{


        signOut(auth);


    });


}