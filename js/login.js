import { auth } from "./firebase.js";


import {

    signInWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";





const email = document.getElementById("email");

const senha = document.getElementById("senha");

const btnLogin = document.getElementById("btnLogin");

const mensagem = document.getElementById("mensagem");

const mostrarSenha = document.getElementById("mostrarSenha");







// MOSTRAR / ESCONDER SENHA


if(mostrarSenha){


    mostrarSenha.addEventListener(
        "click",
        ()=>{


            if(senha.type === "password"){


                senha.type = "text";


                mostrarSenha.innerHTML = "🔓";


            }else{


                senha.type = "password";


                mostrarSenha.innerHTML = "🔒";


            }


        }

    );


}









// LOGIN


btnLogin.addEventListener(
    "click",
    async ()=>{


        const emailDigitado =
        email.value.trim();


        const senhaDigitada =
        senha.value.trim();






        if(
            emailDigitado === "" ||
            senhaDigitada === ""
        ){


            mensagem.innerHTML = `

            ❌ Preencha todos os campos.

            `;


            return;


        }







        try{


            await signInWithEmailAndPassword(

                auth,

                emailDigitado,

                senhaDigitada

            );





            mensagem.innerHTML = `

            ✅ Login realizado com sucesso!

            `;






            setTimeout(()=>{


                window.location.href =
                "index.html";


            },1000);







        }catch(error){



            console.error(
                "Erro login:",
                error
            );



            mensagem.innerHTML = `

            ❌ E-mail ou senha incorretos.

            `;



        }



    }

);