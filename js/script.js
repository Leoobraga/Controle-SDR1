import { db, auth } from "./firebase.js";


import {

collection,
addDoc,
getDocs,
serverTimestamp,
query,
where,
limit

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



import {

onAuthStateChanged,
signOut

} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";





let usuarioAtual = null;

let nomeUsuario = "";






const nome = document.getElementById("nome");

const plataforma = document.getElementById("plataforma");

const status = document.getElementById("status");


const btnCadastrar = document.getElementById("btnCadastrar");


const pesquisa = document.getElementById("pesquisa");

const btnPesquisar = document.getElementById("btnPesquisar");


const resultado = document.getElementById("resultado");


const totalCandidatos = document.getElementById("totalCandidatos");

const dataAtual = document.getElementById("dataAtual");


const btnSair = document.getElementById("btnSair");









async function buscarNomeUsuario(email){


const usuarios = await getDocs(

collection(db,"usuarios")

);



usuarios.forEach((doc)=>{


const usuario = doc.data();



if(usuario.email === email){


nomeUsuario = usuario.nome;


}


});


}







async function carregarTotalCandidatos(){


try{


const consulta = await getDocs(

collection(db,"candidatos")

);



if(totalCandidatos){


totalCandidatos.innerHTML =

consulta.size.toLocaleString("pt-BR");


}



}catch(error){


console.error(
"Erro contador:",
error
);


}


}







function mostrarDataAtual(){


const hoje = new Date();



const dias = [

"Domingo",

"Segunda-feira",

"Terça-feira",

"Quarta-feira",

"Quinta-feira",

"Sexta-feira",

"Sábado"

];



const diaSemana = dias[hoje.getDay()];



const data = hoje.toLocaleDateString("pt-BR");



if(dataAtual){


dataAtual.innerHTML =

`📅 ${diaSemana}, ${data}`;


}


}

// VERIFICA LOGIN


onAuthStateChanged(auth, async(usuario)=>{


    if(usuario){


        usuarioAtual = usuario.email;



        await buscarNomeUsuario(
            usuario.email
        );



        carregarTotalCandidatos();


        mostrarDataAtual();



        console.log(
            "Usuário logado:",
            nomeUsuario
        );



    }else{


        window.location.href =
        "login.html";


    }


});









// BOTÃO SAIR


if(btnSair){


    btnSair.addEventListener(
        "click",
        async()=>{


            try{


                await signOut(auth);


                window.location.href =
                "login.html";



            }catch(error){


                console.error(
                    "Erro ao sair:",
                    error
                );


            }


        }

    );


}









// CADASTRAR CANDIDATO


async function cadastrarCandidato(){


    const nomeDigitado =
    nome.value.trim();




    if(nomeDigitado === ""){


        resultado.innerHTML = `


        <div class="mensagem">

        Digite o nome do candidato.

        </div>


        `;


        return;


    }






    try{



        const nomeBusca =

        nomeDigitado
        .toLowerCase()
        .trim();





        const consulta = await getDocs(

            query(

                collection(db,"candidatos"),


                where(

                    "nomeBusca",

                    "==",

                    nomeBusca

                ),


                limit(1)


            )

        );







        if(!consulta.empty){



            resultado.innerHTML = `


            <div class="mensagem">


            ⚠️ Esse candidato já foi contatado.


            </div>


            `;


            return;


        }








        await addDoc(

            collection(db,"candidatos"),

            {


                nome:
                nomeDigitado,


                nomeBusca:
                nomeBusca,



                responsavel:
                usuarioAtual,



                nomeResponsavel:
                nomeUsuario,



                plataforma:
                plataforma.value,



                status:
                status.value,



                dataCadastro:
                serverTimestamp()



            }


        );







        resultado.innerHTML = `


        <div class="mensagem sucesso">


        ✅ Candidato cadastrado com sucesso!


        </div>


        `;





        nome.value = "";



        carregarTotalCandidatos();



    }catch(error){


        console.error(

            "Erro cadastro:",

            error

        );


    }



}









// PESQUISAR CANDIDATO



async function pesquisarCandidato(){



    const busca = pesquisa.value

    .trim()

    .toLowerCase();






    if(busca === ""){


        resultado.innerHTML = `


        <div class="mensagem">

        Digite um nome.

        </div>


        `;


        return;


    }






    try{



        const consulta = await getDocs(


            query(

                collection(db,"candidatos"),


                where(

                    "nomeBusca",

                    "==",

                    busca

                ),


                limit(1)


            )


        );








        if(consulta.empty){



            resultado.innerHTML = `


            <div class="mensagem">


            Nenhum candidato encontrado.


            </div>


            `;


            return;


        }








        consulta.forEach((doc)=>{


            const candidato = doc.data();




            let data = "Não informado";



            if(candidato.dataCadastro){



                if(candidato.dataCadastro.toDate){


                    data = candidato.dataCadastro

                    .toDate()

                    .toLocaleString("pt-BR");



                }else{


                    data =
                    candidato.dataCadastro;


                }


            }







            resultado.innerHTML = `


            <div class="card-candidato">



            <h2>

            ${candidato.nome}

            </h2>





            <div class="linha">

            <span>👤 SDR:</span>

            <strong>

            ${candidato.nomeResponsavel || "-"}

            </strong>

            </div>






            <div class="linha">

            <span>🌐 Plataforma:</span>

            <strong>

            ${candidato.plataforma || "-"}

            </strong>

            </div>






            <div class="linha">

            <span>📌 Status:</span>

            <strong>

            ${candidato.status || "-"}

            </strong>

            </div>






            <div class="linha">

            <span>📅 Contato:</span>

            <strong>

            ${data}

            </strong>

            </div>





            </div>


            `;



        });







    }catch(error){



        console.error(

            "Erro pesquisa:",

            error

        );


    }



}









// EVENTOS DOS BOTÕES



btnCadastrar.addEventListener(

    "click",

    cadastrarCandidato

);





btnPesquisar.addEventListener(

    "click",

    pesquisarCandidato

);







pesquisa.addEventListener(

    "keypress",

    (e)=>{


        if(e.key === "Enter"){


            pesquisarCandidato();


        }


    }

);