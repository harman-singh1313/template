const express= require('express');
const siteRouter= require('./router/site.routes');
const path= require('path');
const port= 3300;

const app= express();


app.use(express.urlencoded({extended:true}));
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname,'public')));

//set view engine
app.set('view engine','ejs');
//set views folder
app.set('views',path.join(__dirname,'views'));




//email parser routes
const emailRaoutes=require("./router/mailrouter")
app.use('/',emailRaoutes);
//router setup
app.use('/',siteRouter);


//404 page
app.use((req,res)=>{
    res.status(404).render('pages/notfound')
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
});