import { db } from "./firebase.js";


import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";



const arquivo = document.getElementById("arquivo");

const botao = document.getElementById("importar");

const resultado = document.getElementById("resultado");





botao.addEventListener("click", ()=>{


    if(!arquivo.files[0]){


        resultado.innerHTML = `
        ❌ Selecione um arquivo CSV.
        `;

        return;

    }





    const leitor = new FileReader();





    leitor.onload = async function(event){


        try{


            const texto = event.target.result;


            const linhas = texto.split(/\r?\n/);




            let analisados = 0;

            let adicionados = 0;

            let duplicados = 0;

            let vazios = 0;







            // Busca todos os candidatos já existentes

            const consulta = await getDocs(
                collection(db,"candidatos")
            );



            const nomesExistentes = [];




            consulta.forEach((doc)=>{


                const candidato = doc.data();



                if(candidato.nome){


                    nomesExistentes.push(

                        limparNome(candidato.nome)

                    );


                }


            });







            // pula o cabeçalho

            for(let i = 1; i < linhas.length; i++){



                let linha = linhas[i];



                if(!linha.trim()){

                    continue;

                }






                let colunas;



                // aceita CSV com ; ou ,

                if(linha.includes(";")){


                    colunas = linha.split(";");


                }else{


                    colunas = linha.split(",");


                }






                const nome = limparNome(
                    colunas[0]
                    ?.replaceAll('"',"")
                );



                const status = colunas[1]
                ?.replaceAll('"',"")
                .trim();




                const data = colunas[2]
                ?.replaceAll('"',"")
                .trim();




                const sdr = colunas[3]
                ?.replaceAll('"',"")
                .trim();







                // sem nome ignora

                if(!nome){


                    vazios++;

                    continue;


                }





                analisados++;







                // verifica duplicado


                if(

                    nomesExistentes.includes(nome)

                ){


                    duplicados++;

                    continue;


                }







                await addDoc(

                    collection(db,"candidatos"),

                  {
    nome: nome,

    nomeBusca: nome
    .toLowerCase()
    .trim(),

    status: status || "Não contatado",

    dataCadastro: data || "",

    nomeResponsavel: sdr || "",

    responsavel: "",

    plataforma: ""
}


                );






                adicionados++;






                // adiciona para evitar duplicar no mesmo arquivo

                nomesExistentes.push(nome);





            }









            resultado.innerHTML = `


            <div>


            ✅ Importação concluída!


            <br><br>


            Total analisado:
            ${analisados}


            <br>


            Novos candidatos:
            ${adicionados}


            <br>


            Duplicados ignorados:
            ${duplicados}


            <br>


            Linhas sem nome ignoradas:
            ${vazios}



            </div>


            `;







        }catch(error){



            console.error(
                "Erro na importação:",
                error
            );



            resultado.innerHTML = `


            ❌ Erro ao importar.


            `;



        }



    };






    leitor.readAsText(

        arquivo.files[0],

        "UTF-8"

    );



});








// LIMPA O NOME PARA COMPARAÇÃO

function limparNome(nome){


    if(!nome){

        return "";

    }



    return nome

    .toLowerCase()

    .trim()

    .replace(/\s+/g," ");


}

