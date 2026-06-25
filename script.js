window.addEventListener('DOMContentLoaded', () => {
    
    // ====================================================================
    // 📑 PASO 1: CAPTURA DE NODOS DEL DOM
    // Explicación en Demo: "Para optimizar el rendimiento, capturamos en 
    // constantes las referencias del árbol HTML. Así las alteramos en tiempo real."
    // ====================================================================
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

    // ====================================================================
    // 📑 PASO 2: VARIABLES GLOBALES Y PERSISTENCIA DE SESIÓN
    // Explicación en Demo: "Inicializamos las variables del motor de juego. 
    // Recuperamos el récord usando Number() para transformar el texto del localStorage."
    // ====================================================================
    let mejorPuntaje = localStorage.getItem('mejorPuntaje') ? Number(localStorage.getItem('mejorPuntaje')) : Infinity;
    let numeroSecreto = Math.floor(Math.random() * 100) + 1;
    let intentos = 0;
    const MAX_INTENTOS = 10; // Regla de negocio: Límite estricto
    let historialIntentos = [];

    // Mecanismo de seguridad visual por si el navegador bloquea la ruta física de los avatares
    avatarImg.addEventListener('error', function() {
        avatarImg.src = 'avatar-inicio.png';
    });

    // ====================================================================
    // 📑 PASO 3: FUNCIÓN CENTRALIZADA DE INTERFAZ (`actualizarEstado`)
    // Explicación en Demo: "Unificamos en una sola función reutilizable la 
    // inyección de texto (.innerHTML), cambios de color CSS y el cambio del .src del avatar."
    // ====================================================================
    function actualizarEstado(texto, color, rutaAvatar, animacion = false) {
        mensaje.innerHTML = texto; 
        mensaje.style.color = color;
        avatarImg.src = rutaAvatar; // 👁️ SE GATILLA: Cambio visual del Avatar
        avatarContenedor.style.borderColor = color; 
        tarjeta.style.borderColor = color;   
        
        if (animacion) {
            // Microinteracción visual disparada dinámicamente
            avatarContenedor.style.transform = "translateX(-50%) scale(1.15)";
            setTimeout(() => avatarContenedor.style.transform = "translateX(-50%) scale(1)", 300);
        }
    }

    // ====================================================================
    // 📑 PASO 6B: ALGORITMO DE ASIGNACIÓN TÉRMICA (`obtenerPista`)
    // Explicación en Demo: "Calculamos el valor absoluto mediante Math.abs()
    // y segmentamos la cercanía numérica para configurar la experiencia de usuario."
    // ====================================================================
    function obtenerPista(intento, secreto) {
        let diferencia = Math.abs(intento - secreto);
        if (diferencia <= 5) return { texto: '🔥 ¡Muy cerca!', color: '#e67e22' }; 
        if (diferencia <= 15) return { texto: '♨️ Caliente', color: '#e67e22' };   
        if (diferencia <= 30) return { texto: '🌤️ Tibio', color: '#f1c40f' };      
        return { texto: '❄️ Frío', color: '#3498db' };                             
    }

    // ====================================================================
    // 📑 PASO 6A: CONDICIONAL DE DERROTA MÁXIMA (`verificarGameOver`)
    // Explicación en Demo: "Un condicional 'if' verifica tras cada fallo si el 
    // usuario agotó sus oportunidades. Si es verdadero, congelamos la UI."
    // ====================================================================
    function verificarGameOver() {
        if (intentos >= MAX_INTENTOS) {
            // 👁️ SE GATILLA: Inyección definitiva de avatar-game-over.png
            actualizarEstado(`💀 Game Over<br>El número era el ${numeroSecreto}.`, "#e74c3c", "avatar-game-over.png", true);
            
            inputIntento.style.display = "none";
            btnAdivinar.style.display = "none";
            btnReiniciar.style.display = "inline-block"; 
            
            tarjeta.style.boxShadow = "0 0 30px rgba(231, 76, 60, 0.4)";
            return true;
        }
        return false;
    }

    // ====================================================================
    // 📑 PASO 4: EL CEREBRO OPERATIVO (`verificarIntento`)
    // Explicación en Demo: "Esta es la función obligatoria de mi rúbrica. 
    // Orquesta las validaciones iniciales, incrementos y ramificaciones del flujo."
    // ====================================================================
    function verificarIntento() {
        let valor = Number(inputIntento.value);
        
        // 📑 PASO 4A: CONDICIONAL 'IF' PARA CONTROL DE ENTRADAS ERRÓNEAS
        if (isNaN(valor) || valor < 1 || valor > 100 || inputIntento.value.trim() === "") {
            // 👁️ SE GATILLA: avatar-error.png ante strings, campos vacíos o fuera de rango
            actualizarEstado("⚠️ Pon un número del 1 al 100.", "#e74c3c", "avatar-error.png", true);
            return; // Clausura prematura para proteger el motor de cálculos
        }

        // Actualización de contadores e historial en tiempo real
        intentos++;
        contador.textContent = `Intentos: ${intentos} / ${MAX_INTENTOS}`;
        historialIntentos.push(valor);
        historial.textContent = "Historial: " + historialIntentos.join(", ");

        // ====================================================================
        // 📑 PASO 5: ESTRUCTURA CONDICIONAL CENTRAL (if / else)
        // ====================================================================
        if (valor === numeroSecreto) {
            // 📑 PASO 5A: CAMINO DEL ACIERTO (VICTORIA)
            // 👁️ SE GATILLA: avatar-ganaste.png
            actualizarEstado(`🎉 ¡Felicidades!<br>Era el ${numeroSecreto}.`, "#2ecc71", "avatar-ganaste.png", true);
            
            inputIntento.style.display = "none";
            btnAdivinar.style.display = "none";
            btnReiniciar.style.display = "inline-block"; 
            
            tarjeta.style.boxShadow = "0 0 30px rgba(46, 204, 113, 0.5)";
            
            // Lógica de récord de sesión única
            if (intentos < mejorPuntaje) {
                mejorPuntaje = intentos;
                localStorage.setItem('mejorPuntaje', mejorPuntaje);
                actualizarRecordVisual();
            }

            guardarPuntaje(intentos); // Empuja el récord al array persistente
        } else {
            // 📑 PASO 5B: CAMINO DEL FALLO
            if (verificarGameOver()) return; // Si el 'if' interno de Game Over es verdadero, interrumpe.

            // 📑 PASO 6: PROCESAMIENTO Y ASIGNACIÓN DE AVATARES TÉRMICOS
            let pista = obtenerPista(valor, numeroSecreto);
            let imgSeleccionada = 'avatar-frio.png'; 
            
            // 👁️ SE GATILLA: El color de la pista condiciona qué imagen renderizar
            if (pista.color === '#e67e22') imgSeleccionada = 'avatar-fuego.png';
            if (pista.color === '#f1c40f') imgSeleccionada = 'avatar-tibio.png'; 
            
            if (valor < numeroSecreto) {
                actualizarEstado(`⬆️ El número es MAYOR<br>${pista.texto}`, pista.color, imgSeleccionada);
            } else {
                actualizarEstado(`⬇️ El número es MENOR<br>${pista.texto}`, pista.color, imgSeleccionada);
            }
        }
        
        // Mantener el foco activo para optimizar la ergonomía de la interfaz (UX)
        inputIntento.value = "";
        inputIntento.focus();
    } 

    // ====================================================================
    // 📑 PASO 8: RESET DE ESTADOS (`reiniciarJuego`)
    // Explicación en Demo: "Restablece las variables primitivas a cero y 
    // restaura los elementos de visualización originales del HTML."
    // ====================================================================
    function reiniciarJuego() {
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        intentos = 0;
        historialIntentos = [];
        
        contador.textContent = `Intentos: 0 / ${MAX_INTENTOS}`;
        historial.textContent = "Historial: ";
        
        // 👁️ SE GATILLA: Retorno al avatar neutral de inicio
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

    // ====================================================================
    // 📑 PASO 7: PERSISTENCIA ESTRUCTURADA (Manejo de Arrays en LocalStorage)
    // Explicación en Demo: "Para simular una base de datos real, usamos 
    // JSON.stringify() al guardar el array y JSON.parse() al leerlo."
    // ====================================================================
    function guardarPuntaje(nuevosIntentos) {
        let puntajes = JSON.parse(localStorage.getItem('topPuntajes')) || [];
        puntajes.push(nuevosIntentos);
        puntajes.sort((a, b) => a - b); // Ordena de menor a mayor cantidad de intentos
        puntajes = puntajes.slice(0, 3); // Extrae el Top 3 estructural
        localStorage.setItem('topPuntajes', JSON.stringify(puntajes));
        actualizarTableroVisual();
    }

    // Renderizado dinámico del Medallero Visual creando nodos hijos <li>
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
            listaPuntajes.appendChild(li); // Inyección de componentes en el DOM
        });
    }

    function actualizarRecordVisual() {
        if (mejorPuntaje === Infinity) {
            recordContainer.textContent = "🥇 Mejor Récord: --";
        } else {
            recordContainer.textContent = `🥇 Mejor Récord: ${mejorPuntaje} intentos`;
        }
    }

    // Ejecuciones base obligatorias al levantar la aplicación
    actualizarEstado("🎮 ¡Ingresa tu primer número!", "#aaa", "avatar-inicio.png");
    console.log("Debug) Número secreto de esta ronda:", numeroSecreto);
    actualizarTableroVisual();
    actualizarRecordVisual();

    // ====================================================================
    // 📑 PASO 3A: ESCUCHADORES DE EVENTOS ASÍNCRONOS (`addEventListener`)
    // Explicación en Demo: "Los sensores que capturan los disparadores del usuario 
    // para ejecutar las funciones operativas del sistema."
    // ====================================================================
    btnAdivinar.addEventListener('click', verificarIntento);
    btnReiniciar.addEventListener('click', reiniciarJuego);
    inputIntento.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            verificarIntento();
        }
    });
});