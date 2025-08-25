const express= require('express');
const siteRouter= require('./router/site.routes');
const app= express();
const path= require('path');
const port= 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use('/',siteRouter);

app.use((req,res)=>{
    res.status(404).render('pages/notfound')
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
});