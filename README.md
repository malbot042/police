# BRECHA · Unidad de Intervención Policial

## ▶ [Jugar ahora: https://malbot042.github.io/police/](https://malbot042.github.io/police/)

![Portada de BRECHA](portada.png)

Acción táctica **CQB con vista cenital** en un único `index.html`, sin dependencias, con la misma estética retro que [XENO MARINE](https://github.com/malbot042/alien). Formas parte de una unidad de intervención: entras en el edificio, despejas sala a sala y **detienes a los sospechosos**. Disparar es el último recurso: se puntúa más detener que abatir, y se penaliza a quien dispara a alguien que se rinde o a un civil.

Se juega con teclado y ratón, con mando o en el móvil con controles táctiles. La pantalla imita un CRT plano: líneas de barrido, rejilla RGB, separación de colores, brillo difuso y ruido.

## Cómo se juega
- **Niebla de guerra:** solo ves lo que tú o tu equipo tenéis en línea de visión. Las paredes y las puertas cerradas tapan la vista; las ventanas no. Las zonas ya exploradas se quedan en penumbra.
- **Puertas:** se abren al empujarlas o con **E**. Con **F** les das una patada: se abren de golpe y aturden un instante a quien esté detrás. Las puertas con un punto rojo están **cerradas con llave** y solo se abren a patadas.
- **¡Policía!** Con **Espacio** gritas para identificarte. Los sospechosos que te ven pueden rendirse: es más probable si están aturdidos, heridos, desarmados o rodeados por varios agentes. Si fallas, se ponen alerta.
- **Detener:** acércate a un sospechoso rendido o aturdido y **mantén E** para esposarlo. Las armas que suelten se aseguran al pasar por encima (en difícil, alguno finge rendirse y vuelve a por su arma).
- **Civiles y rehenes:** mantén **E** junto a ellos para ponerlos a salvo; salen solos del edificio.
- **Granada aturdidora:** con **G** o clic derecho. Aturde a sospechosos y civiles durante unos segundos… y te deslumbra si la miras.
- La misión acaba cuando todos los sospechosos están detenidos o neutralizados, todos los civiles a salvo y todas las pruebas recogidas.

## Equipo
Según la misión entras **solo, con tu compañero o con un equipo de 4, 6 u 8 agentes**. Tus compañeros:
- te siguen en fila y se reparten los ángulos;
- gritan, piden la rendición y disparan a los sospechosos armados que no se rinden, sin abrir fuego si hay un civil o un compañero en la línea de tiro;
- esposan a los rendidos y ponen a salvo a los civiles que tengan cerca;
- abren las puertas cerradas con llave a patadas.

Órdenes: **C** alterna entre *seguir* y *esperar*; **V** los manda a la posición del cursor.

## Armas
Cada misión define el equipo disponible:

| Tecla | Arma | Características |
|---|---|---|
| P | Pistola (arma corta) | Precisa, 15 balas por cargador |
| S | Subfusil (arma larga) | Ráfaga rápida, 30 balas |
| F | Fusil | Mucho daño, atraviesa a un objetivo |
| E | Escopeta | Perdigones a corta distancia, recarga cartucho a cartucho |

Caminar con **Shift** (sigilo) es más lento pero mucho más preciso; disparar corriendo abre la dispersión.

## Misiones
Los mapas se generan al azar en cada partida: salas, pasillos, muebles, ventanas, puertas traseras y cerraduras cambian siempre.

| # | Misión | Escenario | Agentes | Armas |
|---|---|---|---|---|
| 1 | Orden de detención | Piso | Solo | Pistola |
| 2 | Narcopiso | Piso | 2 | Pistola, escopeta |
| 3 | Taller clandestino | Nave industrial | 4 | Pistola, subfusil |
| 4 | Atraco al banco (rehenes) | Banco | 6 | Pistola, fusil, escopeta |
| 5 | Fiesta en el club (muchos civiles) | Club | 4 | Pistola, subfusil |
| 6 | Laboratorio de droga | Laboratorio | 2 | Pistola, subfusil, escopeta |
| 7 | Mansión del capo (lo queremos vivo) | Mansión | 6 | Todas |
| 8 | Almacén portuario (rehenes) | Almacén | 8 | Todas |

Sospechosos: desarmados (huyen y se rinden con facilidad), con pistola, subfusil, escopeta o fusil. Algunos se atrincheran apuntando a la puerta, otros te buscan y otros retienen rehenes.

## Puntuación
| Acción | Puntos |
|---|---|
| Sospechoso detenido | +100 |
| Sospechoso armado neutralizado | +25 |
| Civil a salvo | +50 |
| Prueba recogida | +75 |
| Arma asegurada | +10 |
| Capo detenido vivo / abatido | +300 / −150 |
| Fuerza injustificada (rendido o desarmado abatido) | −150 |
| Civil herido / muerto por la policía | −40 / −300 |
| Rehén perdido | −100 |
| Agente caído | −120 |
| Bonus de tiempo | variable |

Al final recibes un rango **S, A, B, C o D**. El rango S exige no tener bajas propias, ni civiles muertos ni uso injustificado de la fuerza. El mejor resultado de cada misión y dificultad se guarda en el navegador.

## Dificultad
Se elige en la portada (clic, ←/→ o 1/2/3) o en la selección de misión.

| | Fácil | Medio | Difícil |
|---|---|---|---|
| Daño recibido | 55 % | 100 % | 140 % |
| Tiempo de reacción de los sospechosos | Lento | Normal | Rápido |
| Puntería de los sospechosos | Peor | Normal | Mejor |
| Disposición a rendirse | Alta | Normal | Baja |
| Rendiciones fingidas | No | A veces | A menudo |
| Granadas aturdidoras | 4 | 3 | 2 |
| Puntos | ×0,75 | ×1 | ×1,5 |

## Controles
| Teclado y ratón | Acción |
|---|---|
| WASD | Moverse |
| Shift | Caminar con sigilo (más preciso) |
| Ratón + clic izquierdo | Apuntar y disparar |
| Flechas | Apuntar y disparar sin ratón (útil con touchpad) |
| Espacio | Gritar «¡Policía!» |
| E (mantener) | Esposar, poner a salvo a un civil, recoger pruebas |
| E | Abrir / cerrar puerta |
| F | Patada a la puerta |
| G / clic derecho | Granada aturdidora |
| 1–4, Q, rueda | Cambiar de arma |
| R | Recargar |
| C | Equipo: seguir / esperar |
| V | Equipo: ir a la posición del cursor |
| P / Esc | Pausa (Enter en pausa: abandonar misión) |
| M | Sonido |
| N | Mostrar u ocultar el minimapa |
| Z | Zoom: cerca, normal, lejos (por defecto) o muy lejos |
| H | Controles (en la portada) |

**Mando:** stick izquierdo para moverse, stick derecho para apuntar, RT disparar, A usar, B gritar, X recargar, Y cambiar arma, LT aturdidora, RB patada, LB órdenes al equipo, L3 sigilo, Start pausa.

**Móvil** (en horizontal): mitad izquierda para moverse, mitad derecha para apuntar y disparar, y botones GRITO, E (mantener), PAT, ATU, ARM, EQ, pausa y zoom.

## Jugar en local
Descarga el repositorio y abre `index.html` en el navegador. Con `index.html?portada` se muestra la portada limpia, sin menús (es la que se usa para `portada.png`).

> Para que la dirección de GitHub Pages funcione, Pages debe estar activado en **Settings → Pages → Deploy from a branch → rama `main`, carpeta `/ (root)`**.
