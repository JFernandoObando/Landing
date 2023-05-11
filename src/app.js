const express = require('express');
const exphbs  = require('express-handlebars');
const routes = require('./routes/routes.js')
const app=express()
const path=require('path')
const morgan=require('morgan')

//Extension hbs

  
  // Registra el helper 'basename' para obtener el nombre base sin la extensión


app.set("views",path.join(__dirname,"views"));

// Configuración de express-handlebars
const hbs = exphbs.create({
    layautDir: path.join(app.get("views"),"layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    defaultLayaut: "main",
    extname: ".hbs",
    helpers: {
        removeExtension: function (filename) {
          return path.parse(filename).name;
        }
      }
});
hbs.handlebars.registerHelper('isEqual', (a, b, opts) => {
    return a == b ? opts.fn(this) : opts.inverse(this);
  });
  
app.engine('.hbs', hbs.engine);
//app.set('view engine', 'handlebars');
//Routes
app.set('view engine',".hbs")
app.use(express.static(path.join(__dirname,'public')))
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false}))


app.use(routes)
module.exports=app