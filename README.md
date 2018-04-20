# Speech Analytics Demo

Esta app muestra una transcripción en tiempo real e una serie de preguntas, al mismo tiempo que clasifica dichas preguntas con base en el entrenamiento de un workspace de Watson Assistant.



## Ejecutar la app en IBM Cloud

1. Obtener su cuenta de IBM Cloud, [sign up here][bluemix_signup_url]

2. Descargar e instalar la [CLI de Cloud Foundry][cloud_foundry_url] tool

3. Clonar el respositorio localmente:

  ```
  git clone https://github.com/lgbaeza/speech-to-text-nodejs
  ```

4. `cd` en el directorio

5. Editar `manifest.yml` file y cambiar el `host` a un valor único.

6. Crear el servicio de Watson Speech to Text

7. Crear el servicio de Watson Assistant

8. Crear o importar un workspace en Watson Assistant. Para saber cómo hacerlo, consulta el [Siguiente Video][Watson chatbot video] o sigue el [Recipe Asistente virtual][Watson Assistant Recipe]
8. Configurar las credenciales de los servicios del punto 6 y 7, en el archivo app.js en la línea 52-57

```javascript
var watson_conversation_workspace_id = 'your-conversation-workspace'
var watson_conversation_username = 'your-conversation-username'
var watson_conversation_password = 'your-conversation-password'

var watson_stt_username = 'your-stt-username'
var watson_stt_password = 'your-stt-password'
```

10. Publicar la app en IBM Cloud de acuerdo a las [Instrucciones disponibles en la documentación][publish app ibm cloud]

  ```
  $ cf push
  ```

[bluemix_signup_url]: http://ibm.biz/realtime-tone-signup
[cloud_foundry_url]: https://github.com/cloudfoundry/cli
[issues_url]: https://github.com/IBM-Bluemix/real-time-tone-analysis/issues
[publish app ibm cloud]: https://console.bluemix.net/docs/apps/dep-app-tool.html#cli
[Watson Assistant Recipe]:https://developer.ibm.com/recipes/tutorials/asistente-virtual-con-watson-assistant/
[Watson chatbot video]:https://www.youtube.com/watch?v=Z8KvfN0IpG8