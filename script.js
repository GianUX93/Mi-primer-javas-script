let edad = prompt("¿Cuál es tu edad?");

edad = Number(edad);

if (edad < 13) {
    alert("👦Eres menor de edad, aún no tienes la edad suficiente para votar😔.");
} else if (edad >= 13 && edad < 18) {
    alert("👦Eres un adolescente, Tienes DNI pero no puedes votar🥹.");
} else {
    alert("👨Eres mayor de edad, si puedes votar🎉.");
}