const {ipcMain}=require('electron');
const { connect_db } = require('./db_sqlite');

var connection= connect_db();

function customers(){
    ipcMain.on('get_all_customers',(event,arg)=>{
        connection.each("SELECT * FROM cliente",(err,rows)=>{
            if(err){
                console.log(err);
                throw err;            
            }else{
                event.reply('get_all_customers_reply',rows)
            }
    })
    })
}