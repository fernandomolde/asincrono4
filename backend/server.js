require("dotenv").config();  // Asegúrate de cargar las variables de entorno desde el archivo .env
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());

// Configuración de CORS para permitir solicitudes desde tu frontend en producción
const corsOptions = {
    origin: process.env.REACT_APP_API_URL || 'https://asincrono4back1.vercel.app', // Cambia esto por tu URL de frontend en producción
    methods: ["GET", "POST", "PUT", "DELETE"]  
};
app.use(cors(corsOptions));

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // El host de la base de datos (puede ser un servicio de base de datos en la nube como Amazon RDS o MySQL en otro servidor)
    user: process.env.DB_USER,        // El nombre de usuario de tu base de datos
    password: process.env.DB_PASSWORD, // La contraseña de la base de datos
    database: process.env.DB_NAME,    // El nombre de la base de datos
});



// Conexión a la base de datos MySQL
db.connect((err) => {
    if (err) {
        console.error("Error conectando a MySQL:", err);
    } else {
        console.log("Conectado a MySQL"); 
    }
});

// Rutas de la API

// Seleccionar usuarios (GET)
app.get("/user", async (req, res) => {
    try {
        db.query("SELECT * FROM user", (err, results) => {
            if (err) {
                console.error("Error al obtener usuarios:", err);
                return res.status(500).json(err);
            }
            res.json(results);  // Devuelve los usuarios en formato JSON
        });
    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).json({ message: "Error inesperado al obtener los usuarios" });
    }
});

// Insertar usuario (POST)
app.post("/user", (req, res) => {
    const { name, email } = req.body;
    db.query("INSERT INTO user (name, email) VALUES (?, ?)", [name, email], (err, result) => {
        if (err) {
            console.error("Error al insertar usuario:", err);
            return res.status(500).json({ message: "Error al agregar usuario", error: err });
        }
        res.json({ message: "Usuario agregado", user: { id: result.insertId, name, email } });
    });
});

// Modificar usuario (PUT)
app.put("/user/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        db.query("UPDATE user SET name = ?, email = ? WHERE id = ?", [name, email, id], (err, result) => {
            if (err) {
                console.error("Error al actualizar usuario:", err);
                return res.status(500).json(err);
            }
            res.json({ message: "Usuario actualizado correctamente" });
        });
    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).json({ message: "Error inesperado al actualizar el usuario" });
    }
});

// Eliminar usuario (DELETE)
app.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    try {
        db.query("DELETE FROM user WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar usuario:", err);
                return res.status(500).json(err);
            }
            res.json({ message: "Usuario eliminado correctamente" });
        });
    } catch (error) {
        console.error("Error inesperado:", error);
        res.status(500).json({ message: "Error inesperado al eliminar el usuario" });
    }
});

// Configuración del puerto (Vercel manejará el puerto automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
