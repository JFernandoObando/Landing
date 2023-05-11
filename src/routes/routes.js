const { Router } = require("express");
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require("body-parser");
const fs = require('fs');
const router = Router();
const Task = require("../models/Task");
const getCollectionModel = require('../models/getCollectionModel');
const User = require('../models/Users');
const bcrypt= require('bcrypt')

//const option = require("../models/opciones");
router.use(bodyParser.json());
//Cargar index
router.get("/", async (req, res) => {
  const tasks = await Task.find().lean();
 
  const viewsFolder = path.join(__dirname, "..",'views');
  const archivos = fs.readdirSync(viewsFolder).filter(file => file.endsWith('.hbs') && file !== 'index.hbs'&& file !== 'adm.hbs'&& file !== 'SuperAdmin.hbs'&& file !== 'loginAdm.hbs');
  res.render("index", {
    tasks: tasks,
    archivos:archivos
  });
});

//Cargar loginAdm
router.get("/loginAdm", (req, res) => {
  res.render("loginAdm");
});


//Cargar adm
router.get("/adm", async (req, res) => {
  const tasks = await Task.find().lean();

  const viewsFolder = path.join(__dirname, "..",'views');
  const archivos = fs.readdirSync(viewsFolder).filter(file => file.endsWith('.hbs') && file !== 'index.hbs'&& file !== 'adm.hbs'&& file !== 'SuperAdmin.hbs'&& file !== 'loginAdm.hbs');

console.log(archivos)
  res.render("adm", {
    tasks: tasks,
    archivos:archivos
  });
});








//Solicitar noticias
router.get("/edit/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).lean();
    res.render("edit", {
      task,
    });
  } catch (error) {
    console.log(error);
  }
});

//Editar noticias
router.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const newTitle = req.body.title;
  const newDescription = req.body.description; // Nueva descripción
  console.log(newDescription)
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(id, {
      title: newTitle,
      description: newDescription,
    });
    console.log("Noticia actualizada:", updatedTask);
    res.redirect("/adm");
  } catch (error) {
    console.error("Error al actualizar la noticia:", error);
    res.status(500).send("Error al actualizar la noticia");
  }
});

//Borrar noticia
router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id)

  try {
    const deletedTask = await Task.findByIdAndDelete(id);
    console.log('Noticia eliminada:', deletedTask);
    res.redirect('/adm');
  } catch (error) {
    console.error('Error al eliminar la noticia:', error);
    res.status(500).send('Error al eliminar la noticia');
  }
});




//Peticion server nueva noticia
router.post('/tasks/add', async (req, res) => {
  try {
    // Crear una nueva instancia del modelo de la tarea con los datos recibidos en la petición
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      index:req.body.index
    });

    // Guardar la tarea en la base de datos
    const savedTask = await task.save();

   const taskIndex = savedTask.index; // Obtener el índice de la nueva tarea

    res.json({ taskIndex }); // Enviar el índice como respuesta JSON
   // res.redirect("/adm")
  } catch (error) {
    console.log(error); // Imprimir el error en caso de que ocurra
    res.status(500).send('Ocurrió un error al crear la tarea'); // Enviar una respuesta de error al cliente
  }
});


router.post('/crear-archivo', (req, res) => {
    const nombreArchivo = req.body.nombre;
  
    const rutaArchivo = path.join(__dirname, "..",'views', nombreArchivo);
    const indexFilePath = path.join(__dirname, "..",'views', 'index.hbs');
    const archivoContenido = fs.readFileSync(indexFilePath, 'utf8');
    fs.writeFile(rutaArchivo, archivoContenido, 'utf8', (err) => {
      if (err) {
        console.error('Error al crear el archivo:', err);
        res.status(500).json({ error: 'Error al crear el archivo' });
      } else {
        console.log('Archivo creado exitosamente');
        res.status(200).json({ mensaje: 'Archivo creado exitosamente' });
      }
    });
  });

  router.get('/:archivo', async function(req, res) {
    const nombreNot = req.params.archivo + "noticias";
    
    // Verificar si el modelo ya está definido
    const miModelo = mongoose.models[nombreNot] || getCollectionModel(nombreNot);
  const tasks = await miModelo.find().lean();
 console.log(tasks)
  
   
    const viewsFolder = path.join(__dirname, '..', 'views');
    const archivos = fs.readdirSync(viewsFolder).filter(file => file.endsWith('.hbs') && file !== 'index.hbs'&& file !== 'adm.hbs'&& file !== 'SuperAdmin.hbs'&& file !== 'loginAdm.hbs');
    const archivo = req.params.archivo;
  
    const rutaArchivo = path.join(viewsFolder, archivo + '.hbs');
  
    fs.readFile(rutaArchivo, 'utf8', function(error, contenido) {
      if (error) {
        console.log('Error al leer el archivo:', error);
        res.status(500).send('Error al leer el archivo');
      } else {
        // Aquí pasamos solamente el nombre del archivo sin la ruta completa
        res.render(archivo, {
          tasks: tasks,
          archivos: archivos,
          ides: archivo+"ab"
        });
      }
      
    });
  });
  
  
// Ruta para crear una nueva colección
router.post('/api/crear-coleccion', async function(req, res, next) {
  try {
    const nuevoNombre = req.body.nombre;
    const nuevoTit = req.body.titulo;
    const nuevoCont = req.body.contenido;
  
   if (!nuevoNombre) {
      throw new Error('No se proporcionó un nombre para la nueva colección');
    }

    const miModelo = getCollectionModel(nuevoNombre);
    const nuevaColeccion = await new miModelo({titulo: nuevoTit,contenido: nuevoCont,nombre:nuevoNombre  }).save();
    res.json(nuevaColeccion);
  } catch (error) {
    console.log(error); // Imprime el objeto de error completo en la consola
    res.status(500).json({ message: 'Hubo un error al crear la colección', error: error });
  }
});




router.post('/login', async (req, res) => {
  const { user, email, password } = req.body;

  console.log(email)
  console.log(password) 
  console.log(user)

  try {
    const documents = await User.findOne({email});
    console.log('Documentos encontrados:', documents);
    if (!documents) {
      res.status(500).send('EL USUARIO NO EXISTE');
    } 
    else{
      //if(documents.email=="Superadmin@gmail.com"){
        res.redirect('/adm');
      //}else{
      //  res.redirect('/');
      }
    /*else {
      const isCorrectPassword = await documents.isCorrectPassword(password);

      if (isCorrectPassword) {
        if(documents.email=="Superadmin@gmail.com"){
          res.redirect('/admin');
        }else{
          res.redirect('/');
        }
      } else {
        res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTOS');
      }*/
    
  } catch (err) {
    res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
  }



/*
  try {
    const foundUser = await User.findOne({ email });
    console.log(foundUser)
    if (!foundUser) {
      res.status(500).send('EL USUARIO NO EXISTE');
    } else {
      const isCorrectPassword = await foundUser.isCorrectPassword(password);
      if (isCorrectPassword) {
        if(foundUser.email=="Superadmin@gmail.com"){
          res.redirect('/admin');
        }else{
          res.redirect('/');
        }
      } else {
        res.status(500).send('USUARIO Y/O CONTRASEÑA INCORRECTOS');
      }
    }
  } catch (err) {
    res.status(500).send('ERROR AL AUTENTICAR EL USUARIO');
  }*/
});
/*
const defaultUser = new User({
  user: 'Superadmin',
  email: 'Superadmin@gmail.com',
  password: 'Admin123'
});

defaultUser.save()
  .then(() => {
    console.log('Usuario creado exitosamente');
  })
  .catch((error) => {
    console.error(error);
  });
*/
module.exports = router;
