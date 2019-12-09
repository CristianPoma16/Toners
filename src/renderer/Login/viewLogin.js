const { ipcRenderer } = require("electron");
var webix = require("webix");


function validation() {
  if ($$("id_form").validate()) {
    ipcRenderer.on('validation_reply', (event, arg) => {
webix.message({type: error, text:'Datos incorrectos'})
      newWin()
    });
    var values = {
      id_usuario: $$("id_usuario").getValue(),
      contrasenia: $$("contrasenia").getValue()
    }
    ipcRenderer.send('validation', values)
  }
  else {
    webix.message({ type: "error", text: "Campos Vacios" });
  }
}
function newWin() {
  ipcRenderer.on('newWin_reply', (event, arg) => {
    console.log(arg);
  })

  ipcRenderer.send('newWin', 'pong')
}
webix.ready(function () {
  webix.ui({
    //contenido que va dentro de la ventana.
    view: 'form',
    id: 'id_form',
    elements: [
      {
        id: 'id_usuario',
        label: 'Usuario',
       value: "1105794414",
        labelPosition: "top",
        view: 'text',
        name: "id_usuario"
      },
      {
        id: 'contrasenia',
        view: "text",
        type: "password",
        value: '12345',
        label: 'Contraseña',
        labelPosition: "top",
        name: "contrasenia"
      },
      {
        id: "btnAceptar",
        view: "button",
        label: "Aceptar",
        click: validation,
      }
    ],
    rules: {
      "id_usuario": webix.rules.isNotEmpty,
      "contrasenia": webix.rules.isNotEmpty
    }
  })
  $$("id_usuario").focus();
})

