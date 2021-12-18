const express = require('express');
const app = express();

app.use(express.static(__dirname));

app.get('/',function(req,res){
  res.sendFile(`${__dirname}/project1.html`)
  //__dirname : It will resolve to your project folder.
});

app.listen(3000)