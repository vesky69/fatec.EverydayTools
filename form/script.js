Element.onclick = function IMC() {
    let height, weight, IMC;

    IMC = weight / (height * height)

    if (IMC >= 30) {
        console.log(`${IMC} = Obesidade`)
    } else if (IMC >= 25) {
        console.log(`${IMC} = Excesso de peso`)
    } else if (IMC >= 18.5) {
        console.log(`${IMC} = Peso normal`)
    } else {
        console.log(`${IMC} = Abaixo do peso`)
    }
}