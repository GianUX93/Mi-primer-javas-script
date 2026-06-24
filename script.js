window.addEventListener('DOMContentLoaded', () => {
    
    const inputIntento = document.getElementById("inputIntento");
    const btnAdivinar = document.getElementById('btnAdivinar');
    const mensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contador');
    const recordContainer = document.getElementById('record-container');
    const historial = document.getElementById('historial');
    const btnReiniciar = document.getElementById('btnReiniciar');
    const tarjeta = document.getElementById('game-card');
    const avatarImg = document.getElementById("avatar-emocion");
    const avatarContenedor = document.getElementById("avatar-contenedor");
    const listaPuntajes = document.getElementById("listaPuntajes");
    const tableroContenedor = document.getElementById("tablero-contenedor");

    // 🔴 VARIABLE GLOBAL: Mejor puntaje histórico (Persistente con localStorage)
    let mejorPuntaje = localStorage.getItem('mejorPuntaje') ? Number(localStorage.getItem('mejorPuntaje')) : Infinity;
    
    let numeroSecreto = Math.floor(Math.random() * 100) + 1;
    let intentos = 0;
    const MAX_INTENTOS = 10; // 🟡 Límite establecido
    let historialIntentos = [];

    avatarImg.addEventListener('error', function() {
        avatarImg.src = 'avatar-inicio.png';
    });

    function actualizarEstado(texto, color, rutaAvatar, animacion = false) {
        mensaje.innerHTML = texto; 
        mensaje.style.color = color;
        avatarImg.src = rutaAvatar; 
        avatarContenedor.style.borderColor = color; 
        tarjeta.style.borderColor = color;   
        
        if (animacion) {
            avatarContenedor.style.transform = "translateX(-50%) scale(1.15)";
            setTimeout(() => avatarContenedor.style.transform = "translateX(-50%) scale(1)", 300);
        }
    }

    function obtenerPista(intento, secreto) {
        let diferencia = Math.abs(intento - secreto);
        if (diferencia <= 5) return { texto: '🔥 ¡Muy cerca!', color: '#e67e22' }; 
        if (diferencia <= 15) return { texto: '♨️ Caliente', color: '#e67e22' };   
        if (diferencia <= 30) return { texto: '🌤️ Tibio', color: '#f1c40f' };      
        return { texto: '❄️ Frío', color: '#3498db' };                             
    }

    // 🟡 FUNCIÓN CORREGIDA: Ahora inyecta la nueva imagen "avatar-game-over.png"
    function verificarGameOver() {
        if (intentos >= MAX_INTENTOS) {
            actualizarEstado(`💀 Game Over<br>El número era el ${numeroSecreto}.`, "#e74c3c", "avatar-game-over.png", true);
            
            inputIntento.style.display = "none";
            btnAdivinar.style.display = "none";
            btnReiniciar.style.display = "inline-block"; 
            
            tarjeta.style.boxShadow = "0 0 30px rgba(231, 76, 60, 0.4)";
            return true;
        }
        return false;
    }

    function verificarIntento() {
        let valor = Number(inputIntento.value);
        
        // El estado de error por entrada inválida sigue usando "avatar-error.png"
        if (isNaN(valor) || valor < 1 || valor > 100 || inputIntento.value.trim() === "") {
            actualizarEstado("⚠️ Pon un número del 1 al 100.", "#e74c3c", "avatar-error.png", true);
            return; 
        }

        intentos++;
        contador.textContent = `Intentos: ${intentos} / ${MAX_INTENTOS}`;
        historialIntentos.push(valor);
        historial.textContent = "Historial: " + historialIntentos.join(", ");

        if (valor === numeroSecreto) {
            actualizarEstado(`🎉 ¡Felicidades!<br>Era el ${numeroSecreto}.`, "#2ecc71", "avatar-ganaste.png", true);
            
            inputIntento.style.display = "none";
            btnAdivinar.style.display = "none";
            btnReiniciar.style.display = "inline-block"; 
            
            tarjeta.style.boxShadow = "0 0 30px rgba(46, 204, 113, 0.5)";
            
            if (intentos < mejorPuntaje) {
                mejorPuntaje = intentos;
                localStorage.setItem('mejorPuntaje', mejorPuntaje);
                actualizarRecordVisual();
            }

            guardarPuntaje(intentos);
        } else {
            if (verificarGameOver()) return;

            let pista = obtenerPista(valor, numeroSecreto);
            let imgSeleccionada = 'avatar-frio.png'; 
            
            if (pista.color === '#e67e22') imgSeleccionada = 'avatar-fuego.png';
            if (pista.color === '#f1c40f') imgSeleccionada = 'avatar-tibio.png'; 
            
            if (valor < numeroSecreto) {
                actualizarEstado(`⬆️ El número es MAYOR<br>${pista.texto}`, pista.color, imgSeleccionada);
            } else {
                actualizarEstado(`⬇️ El número es MENOR<br>${pista.texto}`, pista.color, imgSeleccionada);
            }
        }
        
        inputIntento.value = "";
        inputIntento.focus();
    } 

    function reiniciarJuego() {
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        intentos = 0;
        historialIntentos = [];
        
        contador.textContent = `Intentos: 0 / ${MAX_INTENTOS}`;
        historial.textContent = "Historial: ";
        
        actualizarEstado("🎮 ¡Comienza de nuevo!", "#aaa", "avatar-inicio.png");

        inputIntento.style.display = "inline-block";
        btnAdivinar.style.display = "inline-block";
        btnReiniciar.style.display = "none";
        btnAdivinar.disabled = false;

        tarjeta.style.boxShadow = "0 8px 32px rgba(0, 0, 0, 0.4)";
        
        inputIntento.value = "";
        inputIntento.focus();
        actualizarTableroVisual();
    }

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
            tableroContenedor.style.display = "none";
            return;
        }

        tableroContenedor.style.display = "block";

        const medallas = ["🥇 1° Lugar", "🥈 2° Lugar", "🥉 3° Lugar"];
        puntajes.forEach((puntos, index) => {
            let li = document.createElement('li');
            li.style.padding = "6px 0";
            li.style.borderBottom = "1px dashed rgba(255,255,255,0.05)";
            li.textContent = `${medallas[index]}: ${puntos} intentos`;
            listaPuntajes.appendChild(li);
        });
    }

    function actualizarRecordVisual() {
        if (mejorPuntaje === Infinity) {
            recordContainer.textContent = "🥇 Mejor Récord: --";
        } else {
            recordContainer.textContent = `🥇 Mejor Récord: ${mejorPuntaje} intentos`;
        }
    }

    actualizarEstado("🎮 ¡Ingresa tu primer número!", "#aaa", "avatar-inicio.png");
    console.log("Debug) Número secreto de esta ronda:", numeroSecreto);
    actualizarTableroVisual();
    actualizarRecordVisual();

    btnAdivinar.addEventListener('click', verificarIntento);
    btnReiniciar.addEventListener('click', reiniciarJuego);
    inputIntento.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            verificarIntento();
        }
    });
});