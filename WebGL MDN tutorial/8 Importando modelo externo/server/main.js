const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/',function(req,res){
  res.sendFile(`${__dirname}/index.html`)
});

app.get('/test',function(req,res){
  res.sendFile(`${__dirname}/test.html`)
});

app.listen(3000,()=>{
    console.log('Servidor iniciado en el puerto 3000') 
})