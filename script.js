// ==========================
// DATOS PERSONALES
// ==========================
const nombre = 'Gian Carlos Chavez Sanchez';
const edad = 32;
const distrito = 'Lurín';
const oficio = 'product designer';

// Mostrar valor y tipo
console.log(nombre, typeof nombre);
console.log(edad, typeof edad);
console.log(distrito, typeof distrito);
console.log(oficio, typeof oficio);

// ==========================
// MENSAJES
// ==========================

// Forma vieja (concatenación)
const msg1 = 'Hola soy ' + nombre + ', tengo ' + edad + ' años y vivo en ' + distrito + '.';

// Forma moderna (template literals)
const msg2 = `Hola soy ${nombre}, tengo ${edad} años y vivo en ${distrito}.`;

console.log(msg1);
console.log(msg2);

// ==========================
// JUEGO
// ==========================

const numeroSecreto = 5;
let intento = prompt("Adivina el número del 1 al 10");

// Operadores matemáticos
console.log("Suma:", 2 + 2);
console.log("Resta:", 10 - 3);
console.log("Multiplicación:", 4 * 5);

// Resultado
if (Number(intento) === numeroSecreto) {
  alert("🎉 Correcto");
} else {
  alert("❌ Incorrecto");
}