# Backlog — Superlist (MVP)

## Backlog
1a. Como persona, quiero registrarme con email y contraseña, para tener mi propia cuenta.
1b. Como usuario registrado, quiero iniciar y cerrar sesión, para entrar en mi cuenta y salir cuando termine. Requires: #1a
2. Como usuario, quiero crear un grupo, para tener una lista de la compra compartida. Requires: #1a
3. Como usuario, quiero cambiar entre mis grupos, para trabajar en la lista de cada uno. Requires: #2
4. Como miembro, quiero añadir un item a la lista, para que nadie olvide comprarlo. Requires: #2
5. Como miembro, quiero editar un item con sus unidades, precio y tienda, para saber cuánto, a qué precio y dónde se compra. Requires: #4
6. Como miembro, quiero eliminar un item de la lista, para quitar lo que ya no hace falta. Requires: #4
7. Como miembro, quiero marcar un item como comprado, para distinguir lo que falta de lo que ya está en el carro. Requires: #4
8. Como miembro, quiero añadir una tienda propia al grupo, para asignarla cuando no está entre las predefinidas. Requires: #5
9. Como miembro, quiero compartir el link de invitación del grupo, para que otras personas puedan pedir unirse. Requires: #2
10. Como persona con un link de invitación, quiero solicitar unirme al grupo, para participar en su lista. Requires: #1, #9
11. Como dueño, quiero aceptar una solicitud de ingreso, para controlar quién entra al grupo. Requires: #10
12. Como dueño, quiero expulsar a un miembro, para que deje de tener acceso a la lista. Requires: #11
13. Como dueño, quiero transferir la propiedad del grupo a un miembro, para que el grupo siga funcionando sin mí. Requires: #11
14. Como dueño, quiero eliminar el grupo, para cerrarlo cuando ya no se use. Requires: #2
15. Como miembro, quiero abandonar el grupo, para dejar de participar en su lista. Requires: #11

## Assumptions
### Aprobadas
- #1a / #1b: solo email y contraseña, sin login con Google en el MVP.
- #1a: el email se normaliza siempre (sin espacios al principio y al final, en minúsculas), antes de guardarlo y antes de compararlo.
- #1a: el formulario pide solo email y contraseña, sin nombre. Contraseña de al menos 8 caracteres, sin reglas de complejidad.
- #1a: sin verificación de email en el MVP. El mensaje de email duplicado revela que la cuenta existe.
- #1a: las migraciones se aplican en el build de Vercel (no en `pnpm build`) y deben ser compatibles hacia atrás (solo añadir).
- #2: quien crea el grupo pasa a ser su dueño. Cada grupo tiene exactamente una lista.
- #4 / #5: el nombre es obligatorio; unidades, precio y tienda son opcionales. "Unidades" es una cantidad numérica sin unidad de medida (nada de kg o litros en el MVP).
- #5: el precio es unitario y se guarda en céntimos. El total de la línea es unidades × precio.
- #5 / #6: cualquier miembro puede editar o borrar cualquier item, no solo los que creó.
- #7: el item comprado tiene una distinción visual y además aparece en una pestaña "Comprados" donde se ven los productos ya comprados. Se puede desmarcar.
- #8: las tiendas propias solo se ven en el grupo que las creó.
- #9: cualquier miembro puede compartir el link, porque el dueño sigue decidiendo quién entra. Hay un solo link por grupo, reutilizable y sin caducidad.
- #11: rechazar una solicitud va dentro de esta misma historia.
- #12: quien es expulsado pierde el acceso al momento. Los items que creó se quedan en la lista.
- #13: solo se puede transferir a un miembro actual. El antiguo dueño elige si se queda en el grupo como miembro o lo abandona.
- #14: borrar el grupo borra su lista, sus items y sus tiendas propias, y pide confirmación.
- #15: el dueño no puede abandonar el grupo sin transferirlo antes (#13) o eliminarlo (#14).
- #15: los items que creó quien abandona el grupo se quedan en la lista (igual que en #12).
- Tiendas predefinidas: Mercadona, Lidl, Carrefour, MinyMas, MasyMas, Alimerka, Dia.
