const inputIntento = document.getElementById("inputIntento");
const btnAdivinar = document.getElementById('btnAdivinar');
const mensaje = document.getElementById('mensaje');
const contador = document.getElementById('contador');
const historial = document.getElementById('historial');
const btnReiniciar = document.getElementById('btnReiniciar');
const tarjeta = document.getElementById('game-card');

console.log('Elementos encontrados:', inputIntento, btnAdivinar, mensaje);

function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
}
mostrarMensaje("¡Bienvenido al juego de adivinanza!" , "#e94560" );

let numeroSecreto = Math.floor(Math.random() * 100) + 1;
let intentos = 0;
let historialIntentos = [];

console.log("Debug) Número secreto:", numeroSecreto);

function verificarIntento() {
    let valor = Number(inputIntento.value);
    
    if (isNaN(valor) || valor < 1 || valor > 100) {
        mostrarMensaje("Por favor, ingresa un número válido entre 1 y 100.", "orange");
        return; 
    }


    intentos++;
    contador.textContent = "Intentos: " + intentos;


    historialIntentos.push(valor);
    historial.textContent = "Historial: " + historialIntentos.join(", ");

   
    if (valor === numeroSecreto) {
        mostrarMensaje("¡Felicidades! Has adivinado el número secreto: " + numeroSecreto, "green");
        btnAdivinar.disabled = true;
        btnReiniciar.style.display = "block";
        tarjeta.style.borderColor = "green";
        tarjeta.style.boxShadow = "0 0 40px green";
    } else if (valor < numeroSecreto) {
        mostrarMensaje("El número secreto es alto, intenta más bajo.", "#e94560");
    } else {
        mostrarMensaje("El número secreto es bajo, intenta más alto.", "#e94560");
    }
    inputIntento.value = "";
    inputIntento.focus();
} 

function reiniciarJuego() {
    numeroSecreto = Math.floor(Math.random() * 100) + 1;
    intentos = 0;
    historialIntentos = [];
    contador.textContent = "Intentos: " + intentos;
    historial.textContent = "Historial: ";
    mostrarMensaje("¡Nuevo juego! adivina el número secreto." , "#e94560" );

    btnAdivinar.disabled = false;
    btnReiniciar.style.display = "none";

    tarjeta.style.borderColor = "lightgray";
    tarjeta.style.boxShadow = "none";

    console.log("Debug) Nuevo número secreto:", numeroSecreto);

}
btnAdivinar.addEventListener('click', verificarIntento);