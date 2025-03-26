import { useState, useEffect } from "react";
import axios from "axios";

// Usa la URL desde las variables de entorno
const apiUrl = process.env.REACT_APP_API_URL || 'backend-eta-three-10.vercel.app';  

function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Verifica si la URL es válida
        if (apiUrl) {
            axios.get(`${apiUrl}/user`)
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        setUsers(response.data);
                    } else {
                        console.error("La respuesta no es un array", response.data);
                    }
                })
                .catch((error) => console.error("Error al obtener los usuarios:", error));
        } else {
            console.error("API URL no está definida correctamente en el archivo .env");
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (apiUrl) {
            axios
            .post(`${apiUrl}/user`, { name, email }) // Usa correctamente el `apiUrl` aquí
            .then((response) => {
              if (response.data.dato && response.data.user) {
                console.log(response.data.dato); // Muestra el mensaje
                setUsers([...users, response.data.user]); // Añadir el usuario recién creado
                setName(""); // Limpiar los campos del formulario
                setEmail("");
              } else {
                console.error("Respuesta inesperada:", response.data);
              }
            })
            .catch((error) => console.error("Error al agregar usuario:", error));
        } else {
            console.error("API URL no está definida correctamente en el archivo .env");
        }
    };

    return (
        <div>
            <h1>Usuarios</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Agregar</button>
            </form>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button>Actualizar</button>
                        <button>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
