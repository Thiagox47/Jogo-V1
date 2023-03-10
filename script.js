// Variaveis principais.
const dolar = "$";
const dirtyMoney = "Grana suja";
let result = 0;
let multiply = 2.5;

//Let's para valor inicial de Juice, multiplicador de sucos, valor dos vendedores de suco e multiplicador.
let juices = 1;
let juiceMultiplys = 1;
let valueMultiplyJuices = 10;
let valueSellerJuices = 1500;
let popsicles = 3.5;
let popsicleMultiplys = 1;
let valueMuliplyPopsicles = 35;

//Dom de todos os botões de geradores invisiveis e variaveis
let juice_of_orange = document.getElementById("juice_of_orange")
let popsicle_btn = document.getElementById("popsicle").style.display = 'none';
document.getElementById("computer_maintenance").style.display = 'none';
document.getElementById("drop_Shipping").style.display = 'none';
document.getElementById("Bitcoin").style.display = 'none';
document.getElementById("loan_sharking").style.display = 'none';

//Dom de todos os botões de Upgrade invisiveis no html e variaveis
let valueJuiceMult = document.getElementById("juiceMult");
valueJuiceMult.style.display = 'none';
let valueSellerJui = document.getElementById("sellerJui");
valueSellerJui.style.display = 'none';
let valuePopsicles = document.getElementById("moreFlavors");
valuePopsicles.style.display = 'none';
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
        valueJuiceMult.style.display = 'block';
    }
    if (valueSellerJuices <= result) {
        valueSellerJui.style.display = 'block';
    }
    if (valueMuliplyPopsicles <= result) {
        valuePopsicles.style.display = 'block';
    }
}

buttomEnable()

// Função do popup
function popups(texto){
    var popup = document.createElement("div");
    popup.style.backgroundColor = "lightgray";
    popup.style.padding = "20px";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.innerHTML = texto;
    
    // adiciona o elemento ao documento
    document.body.appendChild(popup);
    
    // agenda a remoção do popup após 5 segundos
    setTimeout(function() {
      popup.style.display = "none";
    }, 1000);
    }


//Função para vender suco
function juice() {
    //valor de juice sempre 1, porém podendo ser multiplicado.
    juices = 1
    juices = aplyMultiply(juices, juiceMultiplys)
    resultOperations(juices, '+');
    //valor concatenado no html
    showMoney()
        //Mostrar valor de juices 
    console.log(juices);
    buttomEnable()
    juice_of_orange.innerHTML = `Suco de laranja $ ${juices.toFixed(2)}`

}

//Função para receber valor de juice ao comprar e multiplicador com balanceamento de multiplicação.
function juiceMultiply() {
    if (result >= valueMultiplyJuices) {
        juiceMultiplys += 1.5;
        resultOperations(valueMultiplyJuices, "-")
        valueMultiplyJuices = multiplyGenerationUpgrade(valueMultiplyJuices)
        showMoney()
        valueJuiceMult.innerHTML = `Caixa de laranjas -$ ${valueMultiplyJuices.toFixed(2)}`;
        //aparece a informação do upgrade e adiciona um timer
        popups("Upgrade de multiplicação habilitado!")
    } else {
        //aparece a informação de dinheiro insuficiente e adiciona um timer
        popups("Você não tem saldo suficiente para isso!")
    }
    //mostrar no console o valor do multiplicador.
    console.log(juiceMultiplys);
}

//Função do vendedor de sucos
function sellerJuice() {
    if (result >= valueSellerJuices) {
        resultOperations(valueSellerJuices, "-");
        document.getElementById("sellerJui").style.display = 'none';
        //intervalo que realiza a contagem 
        let juiceInterval = setInterval(juice, 3000);
        showMoney()
        valueSellerJuices = multiplyGenerationUpgrade(valueSellerJuices)
        valueSellerJui.innerHTML = `Chamar outro vendedor de sucos -$ ${valueSellerJuices}`
        popups("Vendedor de sucos habilitado!")
    } else {
        //aparece a informação de dinheiro insuficiente e adiciona um timer
        popups("Você não tem saldo suficiente para isso!")
    }
    console.log(valueSellerJuices)
}

//Função para vender picolés
function popsicle() {
    //valor de popsicles sempre 3.5, porém podendo ser multiplicado.
    popsicles = 3.5
    popsicles = aplyMultiply(popsicles, popsicleMultiplys)
    resultOperations(popsicles, '+');
    //valor concatenado no html
    showMoney()
        //Mostrar valor de juices 
    console.log(popsicles);
    buttomEnable()
    popsicle_btn.innerHTML = `Picolé $ ${popsicles.toFixed(2)}`
}

function more_flavors() {
    let activate = false;

    if (result >= valueMuliplyPopsicles & activate == false) {
        document.getElementById("popsicle").style.display = 'block';
        resultOperations(valueMuliplyPopsicles, "-")
        valueMuliplyPopsicles = multiplyGenerationUpgrade(valueMuliplyPopsicles)
        valuePopsicles.innerHTML = `Mais sabores de Picolés -$ ${valueMuliplyPopsicles.toFixed(2)}`;
        showMoney()
    }

    if (result >= valueMuliplyPopsicles & activate == true) {
        popsicleMultiplys += 3;
        resultOperations(valueMuliplyPopsicles, "-")
        valueMuliplyPopsicles = multiplyGenerationUpgrade(valueMuliplyPopsicles)
        valuePopsicles.innerHTML = `Mais sabores de Picolés -$ ${valueMuliplyPopsicles.toFixed(2)}`;
        popsicle_btn.innerHTML = `Picolé $ ${popsicles.toFixed(2)}`
        showMoney()

        //aparece a informação do upgrade e adiciona um timer
        popups("Upgrade de multiplicação habilitado!")
    } else {
        //aparece a informação de dinheiro insuficiente e adiciona um timer
        popups("Você não tem saldo suficiente para isso!")
    }
    activate = true;
    //mostrar no console o valor do multiplicador.
    console.log(popsicleMultiplys);
}

//Funções que facilitam operações nos mutiplicadores e geradores

//mostrar valor final
function showMoney() {
    let text = document.getElementById("moneyOfPlayer");
    text.innerHTML = `${dolar} ${result.toFixed(2)}`;
}

//Operações de soma e subtração no resultado final 
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

//Multiplicador o valor dos upgrades desejados
function multiplyGenerationUpgrade(generationUpgradeValues) {
    return generationUpgradeValues *= multiply;
}

//Aplica a multiplicação no gerador de dinheiro desejado
function aplyMultiply(generation, multiplye) {
    return generation *= multiplye;
}