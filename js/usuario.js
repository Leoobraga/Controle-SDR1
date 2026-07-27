import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";


let usuarioAtual = null;


onAuthStateChanged(auth, (usuario)=>{


    if(usuario){

        usuarioAtual = usuario.email;

        console.log("Usuário conectado:", usuarioAtual);

    }


});


export { usuarioAtual };