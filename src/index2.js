// se traera la informacion con mongooseDB y se crea las 
//variables de entorno

const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
const e = require("cors");
require("dotenv").config();//no se va a guardar en una variable ,sino que se configura
const app = express();

//configuramos los cors
app.use(cors());
app.use(express.json());

//crear variabel y asignar var de entorno
const mongoUri= process.env.MONGODB_URI; // SE COLOCA LA URI DE CONEXION

//conectar a base de datos

try{
mongoose.connect(mongoUri);
console.log("Conectado a MogoBD");

}catch(error){
console.error("Error de conexion",error);
}

//definir esquema 
const libroSchema= new mongoose.Schema({
    titulo:String,
    autor: String,
})

//crear modelo como las columna en sql
const Libro = mongoose.model("Libro",libroSchema);

//crear ruta de bienvenida

app.get("/api",(req,res)=>{
    res.send("Bienvenidos a la APP tienda de libros");
});

//midelword de autenticacion
app.use((req,res,next)=>{
    const authToken= req.headers["authorization"];
    if (authToken==="Emiliana"){
        next();
    }else{
        res.status(401).send("acceso no autorizado")
    }

})

//rutas con nuestra BD para crear un nuevo libro, aun no tenemos uno
app.post("/libros",async(req,res)=>{
    const libro =new Libro({
      titulo:req.body.titulo,
      autor:req.body.autor,  
    })

    try{
       await libro.save();
       res.json(libro);
    }catch (error){
    res.status(500).send("Error al guardar libro");

    }
});

//ruta para obtener todos los  libros(se crean 10 libros en la BD)
app.get("/libros",async(req,res)=>{
    try{
        const libros = await Libro.find();
        res.json(libros);
    } catch(error){
      res.status(500).send("Error al obtener libros");

    }
});

//traer los libros por ID
app.get("/libros/:id",async(req,res)=>{
    try{
        const libro = await Libro.findById(req.params.id);
        if (libro){
            res.json(libro)
            
        }else{
            res.status(404).send("Libro no encontrado");
        }
    }catch(error){
        res.status(500).send("Error al buscar el libro");
    }
})


//para buscar por nombre del libro o titulo

app.get("/librotitulo",async(req,res)=>{

    try{
        const tituloLibro= req.query.titulo;
        const libro = await Libro.findOne({titulo:tituloLibro})
        if (libro){
            res.json(libro)
        }else {
            res.status(404).send("Libro no encontrado");
        }

    }catch(error){
        res.status(500).send("Error al buscar el libro");
    }
})


//para buscar por autor del libro

app.get("/libroautor",async(req,res)=>{

    try{
        const autorLibro= req.query.autor;
        const libro = await Libro.findOne({autor:autorLibro})
        if (libro){
            res.json(libro)
        }else {
            res.status(404).send("Libro no encontrado");
        }

    }catch(error){
        res.status(500).send("Error al buscar el libro");
    }
})



//actualizar por su id,actualizar por su id,
app.put ("/libros/:id",async(req,res)=>{
    try{
        const actualizarLibro =await Libro.findByIdAndUpdate(
            req.params.id,
            {
                titulo:req.body.titulo,
                autor:req.body.autor,      
            }, req.params.id,
         
            {new:true}
        );
       
        if (actualizarLibro){
            res.json(actualizarLibro);
        }else{
            res.status(400).send("Libro no encontrado");
        }

    }catch(error){

        res.status(500).send("Error al realizar la actualziacion del libro");
    }
});


// para actualizar un libro por su titulo, se valido y se actualizo 3 libros qeu estaban repetidos
/*app.put ("/librotitulo",async(req,res)=>{
    try{
        const actualizarLibro =await Libro.findByIdAndUpdate(
            req.params.titulo,
            {
                titulo:req.body.titulo,
                autor:req.body.autor,      
            }, req.params.id,
         
            {new:true}
        );
       
        if (actualizarLibro){
            res.json(actualizarLibro);
        }else{
            res.status(400).send("Libro no encontrado");
        }

    }catch(error){

        res.status(500).send("Error al realizar la actualziacion del libro");
    }
});

*/

// para eliminar un libro , se valido y funciono

app.delete("/libros/:id",async(req,res)=>{
    try{
        const eliminarLibro= await Libro.findByIdAndDelete( req.params.id);
        if (eliminarLibro){
            res.status(204).send();//204 para indicar que la opracion fue exitosa
        }else{
            res.status(404).send("Libro no encontrado");
        }
    }catch(error){
        res.status(505).send("Error al eliminar el libro");
    }

})


// para decir donde se va a estar ejecutando,levantar el servidor


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("servidor ejecutandose en http://localhost:3000");
});


