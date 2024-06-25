# Introducción

El desarrollo consiste en la generación de una webapp, en Angular 17, que se debe ejecutar como un plugin dentro de Oracle Field Service (OFS) Mobility, como base para los desarrollos de plugins con API.

## Configuración Externa En OFSC Requerida

Se requiere establecer los siguien tes parámetros en la configuración del plugin dentro de OFS:

### En la sección ”General Information” o “Información General”

- Name (Spanish): _Nombre plugin_
- Name (English): _Nombre plugin_
- Label: _etiqueta_plugin_
- Entity: _Entidad_
- Visibility Rules similar to: _Solo Si Aplica_

### En la sección “Plugin Settings” o “Configuración del Plugin”:

- Type: Archivo de plugin
- Plugin Archivo: Cargar el archivo .zip generado
- Disable plugin in offline: No seleccionado (aunque debe considerarse que en caso de que el plugin consuma servicios de internet, no podrá funcionar)
- Secure parameters: _Solo Si Aplica_

### En la sección “Available Properties” o “Propiedades Disponibles”:

- _Solo Si Aplica_

## Mapeo con Propiedades OFS

Dentro del plugin las propiedades de OFS se mapean de la siguiente manera:
| OFS | Plugin |
|----------------------------|---------------------|

## Comunicación con OFSC

El plugin se comunica con OFSC a través de la API "message" de los navegadores:

- Reaccionando al evento 'message' del objecto Window para recibir información de OFSC.
- Ejecutando el método Window.postMessage() para enviar información a OFSC.

Toda esta interacción está encapsulada en el servicio `ofs-api-plugin.service.ts` en el plugin.

Más información en la documentación de Oracle: https://docs.oracle.com/en/cloud/saas/field-service/fapcf/c-flowcharts.html

## Desarrollo Local

Para desarrollar localmente sobre este proyecto se deben seguir los siguientes pasos:

1. Se recomienda instalar Node.js v20.10.0 LTS o superior y NPM 10.3.0 o superior.
2. Clonar este repositorio.
3. En caso de que se requieran consultar servicios de SOA, renombrar el archivo `src/assets/config/config.example.js` a `src/assets/config/config.js` y modificar los valores de `soa_url`, `soa_user` y `soa_password` a los requeridos por la instancia de SOA que se desea consultar.
4. Ejecutar `npm install` para descargar todas las librerías.
5. Ejecutar `ng serve` o `ng serve --disable-host-check` si se quiere acceder al plugin desde una instancia externa de OFSC.

## Build y Deploy

1. Ejecutar `ng build`
2. Crear y o editar el archivo de configuración `src/assets/config/config.js` utilizando como ejemplo el archivo `src/assets/config/config.example.js`.
3. Comprimir en `.zip` el contenido de la carpeta `dist` (generada por el comando del paso 1) asegurándose de excluir los archivos con extensiones que no sean `.js`, `.html` o `.css` (específicamente eliminar cualquier `.txt` o `.ico` que el CLI de Angular haya generado).
4. Cargar el archivo comprimido en la pantalla de configuración del plugin en Oracle Field Service.

## Contribuir (Modificaciones)

Se recomienda realizar cualquier modificación siguiendo la técnica de "Smart and Dumb Components" muy utilizada en el ecosistema de Angular, donde la lógica se introduce en stores utilizando la librería Component Store.
Adicionalmente, se recomienda introducir toda la lógica nueva en el archivo `app.store.ts` o en su defecto en los stores locales de cada componente que se comunican con el antes mencionado, con el objetivo de mantener las componentes lo más vacías posibles de lógica.
Debido a que este plugin es una plantilla, se recomienda personalizar los nombres genéricos del proyecto (package), stores e index html, para una mejor diferenciación.
