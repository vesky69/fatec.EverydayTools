/**
 * @author Júlia Dias <jdoc173@gmail.com>
 * @since 2026-02-24
 * @version 1.0.0
 * @description Esta função busca o campo data pelo id e aplica o atributo max com o dia atual.
 */

function configDateLimit() {
    const limit = new Date().toISOString().split("T")[0]
    alert(limit)
    const inputDate = document.getElementById("date");

    if(inputDate) {
        inputDate.setAttribute("max", limit);
    }

}
document.addEventListener("DOMContentLoaded", configDateLimit);

/* function age(birth) {
    const dateBirth = new Date(birth);
    const today = new Date();

    let age = today.getFullYear() - dateBirth.getFullYear()
    const month = today.getMonth() - dateBirth.getMonth()

    if (month <0 || (month === 0 && today.getDate() < dateBirth.getDate() )) {
        age--;
    }

    return age;
} */

function IMC(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);

    const IMC = weight / (height * height);

    let classification = "";
    if (IMC >= 30) {
        classification = "Obesidade";
    } else if (IMC >= 25) {
        classification = "Excesso de peso";
    } else if (IMC >= 18.5) {
        classification = "Peso normal";
    } else {
        classification = "Abaixo do peso";
    }

    document.getElementById("resultIMC").innerText = `${name}, seu IMC é ${IMC.toFixed(2)} (${classification})`;
    //console.log(`${name}, seu IMC é ${IMC.toFixed(2)} (${classification})`);

    const resultDiv = document.getElementById("result");
    const resetIMC = document.getElementById("resetIMC");
    const calcIMC = document.getElementById("calcIMC");

    calcIMC.addEventListener('click', function() {
        resultDiv.style.display = "flex";
    })

    resetIMC.addEventListener('click', function() {
        resultDiv.style.display = "none";
    })
}

