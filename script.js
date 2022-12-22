// Variaveis principais.
const dolar = "$";
const dirtyMoney = "Grana suja";
let result = 0;
let multiply = 2.5;
// Variavel da div de alerta
let alertPage = document.getElementById("alertDiv")
alertPage.style.display = "none";
//Let's para valor inicial de Juice, multiplicador de sucos, valor dos vendedores de suco e multiplicador.
let juices = 1;
let juiceMultiplys = 1;
let valueMultiplyJuices = 10;
let valueSellerJuices = 350;
let timerJuiceClick = 3;
let juiceInterval;
//Dom de todos os botões de geradores invisiveis e variaveis
let juice_of_orange = document.getElementById("juice_of_orange")
document.getElementById("perfume_of_magazine").style.display = 'none';
document.getElementById("computer_maintenance").style.display = 'none';
document.getElementById("drop_Shipping").style.display = 'none';
document.getElementById("Bitcoin").style.display = 'none';
document.getElementById("loan_sharking").style.display = 'none';
//Dom de todos os botões de Upgrade invisiveis no html e variaveis
document.getElementById("juiceMult").style.display = 'none';
let valueJuiceMult = document.getElementById("juiceMult");
document.getElementById("sellerJui").style.display = 'none';
document.getElementById("technician").style.display = 'none';
document.getElementById("website").style.display = 'none';
document.getElementById("queryBit").style.display = 'none';
document.getElementById("threaten").style.display = 'none';
//Recebimento do nome do jogador.
let nomeHtml = document.getElementById("nameOfPlayer");
nomeHtml.innerHTML += prompt("Qual o seu nome?");
//Função para verificar se botões devem estar aparecendo ou não.
function buttomEnable() {
    if (valueMultiplyJuices <= result) {
        document.getElementById("juiceMult").style.display = 'block';
    }
    if (valueSellerJuices != 'none') {
        if (result >= valueSellerJuices) {
            document.getElementById("sellerJui").style.display = 'block';
        } else {
            document.getElementById("sellerJui").style.display = 'none';
        }
    }

}
// Função para o tempo do alert div
function mesage_div_Clock() {
    let clock_mesage = setTimeout(() => {
        alertPage.style.display = 'none';
        clearTimeout(clock_mesage)
    }, 3000);
}

//Função para receber valor de juice ao comprar e multiplicador com balanceamento de multiplicação.
function juiceMultiply() {
    if (result >= valueMultiplyJuices) {
        juiceMultiplys += 0.5;
        resultOperations(valueMultiplyJuices, "-")
        valueMultiplyJuices = multiplyGenerationUpgrade(valueMultiplyJuices)
        showMoney()
        valueJuiceMult.innerHTML = `Laranjão -$ ${valueMultiplyJuices.toFixed(2)}`;
        //aparece a informação do upgrade e adiciona um timer
        alertPage.innerHTML = "Upgrade de multiplicação habilitado!"
        alertPage.style.display = 'block';
        mesage_div_Clock()
    } else {
        //aparece a informação de dinheiro insuficiente e adiciona um timer
        alertPage.style.display = 'block';
        alertPage.innerHTML = "Você não tem saldo suficiente para isso!"
        mesage_div_Clock()
    }
    //mostrar no console o valor do multiplicador.
    console.log(juiceMultiplys);
}

//Função de quando o botão de gerador e utilizado.
function juice() {
    //valor de juice sempre 1, porém podendo ser multiplicado.
    juices = 1;
    juices = aplyMultiply(juices, juiceMultiplys)
    resultOperations(juices, '+');
    //valor concatenado no html
    showMoney()
        //Mostrar valor de juices 
    console.log(juices);
    buttomEnable()
    juice_of_orange.innerHTML = `Suco de laranja +$ ${juices.toFixed(2)}`

}

//Função para facilitar criação de multiplicadores e geradores
//mostrar valor
function showMoney() {
    let text = document.getElementById("moneyOfPlayer");
    text.innerHTML = `${dolar} ${result.toFixed(2)}`;
}
//Operações de soma e subtração com o valor do gerador
function resultOperations(generationValues, operation) {
    switch (operation) {
        case '-':
            return result = result - generationValues
            break
        case '+':
            return result = result + generationValues
            break
        default:
            break
    }
}
//Multiplicador do valor do upgrade dos geradores
function multiplyGenerationUpgrade(generationUpgradeValues) {
    return generationUpgradeValues *= multiply;
}
//Aplicar a multiplicação no gerador
function aplyMultiply(generation, multiplye) {
    return generation *= multiplye;
}
//Clique automatico
function sellerJuice() {
    if (result >= valueSellerJuices) {
        resultOperations(valueSellerJuices, "-");
        document.getElementById("sellerJui").style.display = 'none';
        juiceInterval = setInterval(juice, timerJuiceClick * 1000);
        valueSellerJuices = multiplyGenerationUpgrade(valueSellerJuices)
        alertPage.innerHTML = "Vendedor de sucos habilitado!"
        alertPage.style.display = 'block';
        mesage_div_Clock()
    } else {
        alert("Você não tem saldo suficiente para isso!")
    }
    console.log(valueSellerJuices)
}
