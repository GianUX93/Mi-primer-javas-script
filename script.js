// Esperar obligatoriamente a que el HTML esté completamente cargado en memoria
window.addEventListener('DOMContentLoaded', () => {
    
    // 1. Selección interna y segura de elementos del DOM
    const inputIntento = document.getElementById("inputIntento");
    const btnAdivinar = document.getElementById('btnAdivinar');
    const mensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contador');
    const historial = document.getElementById('historial');
    const btnReiniciar = document.getElementById('btnReiniciar');
    const tarjeta = document.getElementById('game-card');
    const avatarImg = document.getElementById("avatar-emocion");
    const listaPuntajes = document.getElementById("listaPuntajes");

    // 2. Variables de estado del juego
    let numeroSecreto = Math.floor(Math.random() * 100) + 1;
    let intentos = 0;
    let historialIntentos = [];

    // 3. Función unificada para mutar estados (Dirección de Arte Reactiva)
    function actualizarEstado(texto, color, rutaAvatar, animacion = false) {
        mensaje.textContent = texto;
        mensaje.style.color = color;
        avatarImg.src = rutaAvatar; 
        avatarImg.style.borderColor = color; // Cambia el contorno del avatar
        tarjeta.style.borderColor = color;   // Sincroniza el contorno de la Card completa
        
        if (animacion) {
            avatarImg.style.transform = "translateX(-50%) scale(1.15)";
            setTimeout(() => avatarImg.style.transform = "translateX(-50%) scale(1)", 300);
        }
    }

    // 4. Medidor de temperatura para feedback de proximidad
    function obtenerPista(intento, secreto) {
        let diferencia = Math.abs(intento - secreto);
        if (diferencia <= 5) return { texto: '🔥 ¡Muy cerca!', tipo: 'fuego' };
        if (diferencia <= 15) return { texto: '♨️ Caliente', tipo: 'fuego' };
        if (diferencia <= 30) return { texto: '🌤️ Tibio', tipo: 'frio' };
        return { texto: '❄️ Frío', tipo: 'frio' };
    }

    // 5. Procesamiento principal del tiro o intento
    function verificarIntento() {
        let valor = Number(inputIntento.value);
        
        if (isNaN(valor) || valor < 1 || valor > 100 || inputIntento.value.trim() === "") {
            actualizarEstado("⚠️ Pon un número del 1 al 100.", "orange", "avatar-inicio.png", true);
            return; 
        }

        intentos++;
        contador.textContent = "Intentos: " + intentos;
        historialIntentos.push(valor);
        historial.textContent = "Historial: " + historialIntentos.join(", ");

        if (valor === numeroSecreto) {
            actualizarEstado(`🎉 ¡Felicidades! Era el ${numeroSecreto}.`, "#2ecc71", "avatar-ganaste.png", true);
            
            // UX Adjustment: Ocultamos input y botón de tiro; mostramos el de reinicio en el mismo espacio
            inputIntento.style.display = "none";
            btnAdivinar.style.display = "none";
            btnReiniciar.style.display = "inline-block"; 
            
            tarjeta.style.boxShadow = "0 0 30px rgba(46, 204, 113, 0.5)";

            guardarPuntaje(intentos);
        } else {
            let pista = obtenerPista(valor, numeroSecreto);
            let imgSeleccionada = (pista.tipo === 'fuego') ? 'avatar-fuego.png' : 'avatar-frio.png';
            
            if (valor < numeroSecreto) {
                actualizarEstado(`⬆️ El número es MAYOR (${pista.texto})`, "#3498db", imgSeleccionada);
            } else {
                actualizarEstado(`⬇️ El número es MENOR (${pista.texto})`, "#e67e22", imgSeleccionada);
            }
        }
        
        inputIntento.value = "";
        inputIntento.focus();
    } 

    // 6. Reseteo y limpieza para comenzar una nueva partida
    function reiniciarJuego() {
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        intentos = 0;
        historialIntentos = [];
        
        contador.textContent = "Intentos: 0";
        historial.textContent = "Historial: ";
        
        // Restablece colores base (#aaa) de la interfaz de forma síncrona
        actualizarEstado("🎮 ¡Bienvenido! Ingresa un número.", "#aaa", "avatar-inicio.png");

        // UX Reverse: Volvemos a mostrar el input/adivinar y escondemos el reinicio
        inputIntento.style.display = "inline-block";
        btnAdivinar.style.display = "inline-block";
        btnReiniciar.style.display = "none";
        btnAdivinar.disabled = false;

        tarjeta.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
        
        inputIntento.value = "";
        inputIntento.focus();
    }

    // 7. Persistencia de récord (Local Storage)
    function guardarPuntaje(nuevosIntentos) {
        let puntajes = JSON.parse(localStorage.getItem('topPuntajes')) || [];
        puntajes.push(nuevosIntentos);
        puntajes.sort((a, b) => a - b); 
        puntajes = puntajes.slice(0, 3); 
        localStorage.setItem('topPuntajes', JSON.stringify(puntajes));
        actualizarTableroVisual();
    }

    function actualizarTableroVisual() {
        let puntajes = JSON.parse(localStorage.getItem('topPuntajes')) || [];
        listaPuntajes.innerHTML = "";

        if (puntajes.length === 0) {
            listaPuntajes.innerHTML = "<li style='padding: 5px 0;'>Aún no hay récords guardados. 🚀</li>";
            return;
        }

        const medallas = ["🥇 1° Lugar", "🥈 2° Lugar", "🥉 3° Lugar"];
        puntajes.forEach((puntos, index) => {
            let li = document.createElement('li');
            li.style.padding = "6px 0";
            li.style.borderBottom = "1px dashed rgba(255,255,255,0.05)";
            li.textContent = `${medallas[index]}: ${puntos} intentos`;
            listaPuntajes.appendChild(li);
        });
    }

    // 8. Inicialización por primera vez
    actualizarEstado("🎮 ¡Bienvenido! Ingresa un número.", "#aaa", "avatar-inicio.png");
    console.log("Debug) Número secreto de esta ronda:", numeroSecreto);
    actualizarTableroVisual();

    // 9. Listeners de eventos de usuario
    btnAdivinar.addEventListener('click', verificarIntento);
    btnReiniciar.addEventListener('click', reiniciarJuego);
    inputIntento.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            verificarIntento();
        }
    });
});