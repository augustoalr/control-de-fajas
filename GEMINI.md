# Resumen del Proyecto: Control de Fajas

## Objetivo del Proyecto
Esta es una aplicación web de inventario construida con React para gestionar el stock de fajas. Permite a los usuarios agregar, editar, eliminar y visualizar fajas, clasificándolas como "en stock" o "vendidas".

## Tecnologías Principales
- **Framework:** React con Vite.
- **Backend y Base de Datos:** Supabase (utilizado para almacenar fajas y compañías).
- **UI/Componentes:** React-Bootstrap.
- **Funcionalidades Adicionales:**
  - Exportación de datos a PDF (`jspdf`, `jspdf-autotable`).
  - Exportación de datos a Excel (`exceljs`).
  - Notificaciones al usuario (`react-hot-toast`).
  - Progressive Web App (PWA) configurada con `vite-plugin-pwa`.

## Estado Actual del Proyecto
La aplicación es completamente funcional y está lista para pruebas de uso real. Las características implementadas incluyen:
- **Gestión de Fajas:** CRUD completo (Crear, Leer, Actualizar, Eliminar).
- **Gestión de Compañías:** CRUD completo.
- **Vistas:** Pestañas separadas para "Stock", "Vendidas" y "Agregar Nueva".
- **Búsqueda y Filtros:** Búsqueda por término y filtro por mes en las fajas vendidas.
- **Exportación:** Generación de reportes en PDF y Excel para el stock y las ventas.
- **Selección Múltiple:** Se ha implementado la capacidad de seleccionar múltiples fajas en la tabla para eliminarlas en lote.
- **UI Responsiva:** La aplicación se adapta a vistas de escritorio y móvil.
- **Mejoras de UX:** Se añadió un placeholder y un botón para limpiar los campos de fecha, mejorando la experiencia en navegadores móviles (especialmente en iOS).

## Último Cambio Realizado
Se implementó la lógica para seleccionar múltiples fajas en el componente `FajasTable.jsx` y se agregó la función `handleDeleteSelected` en `App.jsx` para permitir la eliminación masiva de registros desde la base de datos de Supabase.

## Instrucciones para reiniciar el contador de fajas/registros a cero en supabase

  **Aquí te explico el porqué y el cómo hacerlo correctamente en Supabase.**

  **¿Por Qué Hay que Eliminar los Registros Primero?**

  El id de tu tabla es la llave primaria (Primary Key). Esto significa que cada valor en esa
  columna debe ser único e irrepetible.

   * Si tienes registros con id 1, 2, 3, etc., y simplemente reinicias el contador para que empiece
     en 1 de nuevo, la base de datos fallará en cuanto intente insertar un nuevo registro.
   * Intentará asignarle el id 1, pero como ya existe un registro con ese id, se producirá un error
     de "violación de llave primaria" (primary key violation), y la inserción no se completará.    

  **¿Cómo Funciona el Contador en Supabase/PostgreSQL?**

  En Supabase (que usa PostgreSQL por debajo), el contador que genera los IDs autoincrementales se 
  llama una `SEQUENCE`. Es un objeto de la base de datos separado de la tabla, que simplemente se  
  encarga de generar el siguiente número disponible.

  El nombre de esta secuencia sigue una convención: nombreTabla_nombreColumna_seq. Para tu caso, la
   secuencia se llama fajas_id_seq.

  **El Proceso Correcto para Reiniciar el Contador (Paso a Paso)**

  Puedes hacer todo esto directamente desde el SQL Editor en tu panel de Supabase.

   1. Paso 0 (MUY RECOMENDADO): Haz una Copia de Seguridad.
      Antes de hacer cualquier cambio destructivo, SIEMPRE es una buena práctica hacer una copia de
   seguridad. En Supabase, puedes ir a Project Settings > Backups y tomar un backup manual si lo   
  deseas.

   2. Paso 1: Eliminar Todos los Registros de la Tabla.
      Ejecuta el siguiente comando en el SQL Editor. Este comando eliminará TODOS los registros de
  la tabla fajas, dejándola completamente vacía.

   1     DELETE FROM public.fajas;

   3. Paso 2: Reiniciar la Secuencia del `id`.
      Una vez que la tabla está vacía, ejecuta este segundo comando. Este le dice al contador que
  el próximo ID que debe generar es el 1.

   1     ALTER SEQUENCE public.fajas_id_seq RESTART WITH 1;

  **Resumen del Proceso**

  En resumen, los pasos son:

   1. Hacer backup (opcional pero recomendado).
   2. Vaciar la tabla con el comando DELETE.
   3. Reiniciar el contador con el comando ALTER SEQUENCE.

  Una vez que hayas hecho esto, la próxima faja que agregues a través de tu aplicación tendrá el  
  id 1, la siguiente el 2, y así sucesivamente. ¡Justo lo que necesitas para empezar en producción

  # REVISION DE SEGURIDAD PENDIENTE

  Resumen Clave

   * La mejor alternativa gratuita es Supabase Auth, porque ya está incluido en el plan gratuito que
     usas.
   * Un modal de login en un repositorio público es seguro. La seguridad no depende de ocultar el
     código del formulario.
   * La verdadera seguridad está en proteger tus claves de API usando un archivo .env y añadiéndolo al       
     .gitignore.

  Si estás de acuerdo, podemos proceder. El primer paso sería asegurarnos de que tus claves de
  Supabase estén en un archivo .env.local y no directamente en el código. ¿Quieres que revise tu
  archivo supabaseClient.js para confirmarlo?
