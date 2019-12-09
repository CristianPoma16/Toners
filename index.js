const { app, BrowserWindow, ipcMain } = require('electron');
const { connect_db } = require('./db/db_sqlite');
const { crud_db } = require('./db/controller_products');

// Mantén una  global del objeto window, si no lo haces, la ventana 
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
let login
let db
let crud
let win
//crea la ventana principal
function createLogin() {
    // Crea la ventana del navegador.
    win = new BrowserWindow({
        width: 300,
        height: 260,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })
    // and load the index.html of the app.
    // win.loadURL(`file://${__dirname}/index.html`);
    win.loadURL(`file://${__dirname}/src/renderer/Login/index.html`);

    // win.loadFile('index.html')


    // Emitido cuando la ventana es cerrada.
    win.on('closed', () => {
        //borra instancia de base datos
        db.close()
        db = null
        // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
        // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
        // en el que deberías borrar el elemento correspondiente.
        win = null

    })
    //Instancia de la Base de Datos
    db = connect_db();
    crud = crud_db();
}


// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
    // En macOS es común para las aplicaciones y sus barras de menú
    // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
module,
    // Este método será llamado cuando Electron haya terminado
    // la inicialización y esté listo para crear ventanas del navegador.
    // Algunas APIs pueden usarse sólo después de que este evento ocurra.

    app.on('ready', function () {
        createLogin()
    })

app.on('activate', () => {
    // En macOS es común volver a crear una ventana en la aplicación cuando el
    // icono del dock es clicado y no hay otras ventanas abiertas.    
    if (win === null) {
        createLogin()
    }
})

ipcMain.on('validation', (event, values) => {
    db.serialize(function () {
        db.each("SELECT id_usuario,contrasenia FROM usuarios;", (err, cols) => {
            if (err) {
                event.reply('validation_reply', 'error');
                throw err;
            }
            else {
                if (cols.id_usuario === values.id_usuario && cols.contrasenia === values.contrasenia) {
                    console.log('CORRECTO');
                    win.setResizable(true)
                    win.maximize()
                    win.center()
                    win.loadURL(`file://${__dirname}/src/renderer/navegador/index.html`);
                }
                else {
                    console.log('Incorrecto');
                    event.reply('validation_reply', 'error');
                }
            }
        });
    })
});

ipcMain.on('closeWin', (event, arg) => {
    win.setMaximizable(false)
    win.setBounds({ x: 0, y: 0, width: 300, height: 260 })
    win.center()
    win.loadURL(`file://${__dirname}/src/renderer/Login/index.html`);
    event.reply('closeWin_reply', 'ping');
})
