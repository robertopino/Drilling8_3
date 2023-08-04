const express = require("express");
const bodyParser = require("body-parser");
const jugadores = require("./jugadores.json");
const app = express();
app.use(bodyParser.json());

app.listen(3000, () => console.log("Servidor Iniciado"));

app.get("/api/jugadores", (req, res) => {
	res.statusCode = 200;
	res.send(jugadores);
});

//* Verifica que el ID sea válido
app.get("/api/jugadores/:id", (req, res) => {
	const id = req.params.id;
	try {
		const jugador = jugadores.listaJugadores.find((j) => j.id === id);
		console.log(jugador);
		if (jugador === undefined) {
			throw new Error();
		}
		res.status(200).json({
			data: jugador,
		});
	} catch (err) {
		res.status(404).json({
			message: "Error, no existe jugador asociado al ID",
		});
	}
});

//* Verifica que el ID sea único
app.post("/api/jugadores", (req, res) => {
	const datos = req.body;
	try {
		const jugadorId = jugadores.listaJugadores.find((jugador) => jugador.id == datos.id);
		if (jugadorId !== undefined) {
			throw new Error(jugadorId.nombre);
		}

		jugadores.listaJugadores.push(datos);
		res.status(201).json({
			data: datos,
		});
	} catch (err) {
		res.status(409).json({
			message: `Error, ID asociado a un jugador`,
		});
	}
});

app.delete("/api/jugadores/:id", (req, res) => {
	// obtendremos al jugador según ID
	const jugadorAEliminar = req.params.id;
	// Se crea una nueva lista de objetos diferentes al jugador a eliminar
	const listaNueva = jugadores.listaJugadores.filter((l) => l.id !== jugadorAEliminar);
	if (listaNueva.length === jugadores.listaJugadores.length) {
		return res.status(404).json({
			message: "Error, no existe jugador asociado al ID",
		});
	}
	// Retornamos la lista de jugadores
	return res.status(200).json({
		data: listaNueva,
	});
});

app.put("/api/jugadores/:id", (req, res) => {
	// obtenemos los parámetros, el id a actualizar
	const jugadorActualizar = req.params.id;
	const jugador = req.body;
	jugador.id = jugadorActualizar;
	// Buscamos si el jugador se encuentra en la lista
	// de objetos Jugadores
	const indiceJugadorActualizar = jugadores.listaJugadores.findIndex((l) => l.id === jugadorActualizar);
	// Si el jugador no esta en la lista, retornamos false
	if (indiceJugadorActualizar === -1)
		return res.status(404).json({
			message: "Error, no existe jugador asociado al ID",
		});
	// Mi primera función ternaria. No la encuentro muy intuitiva.
	if (jugador.nombre || jugador.posicion) {
		jugadores.listaJugadores[indiceJugadorActualizar].nombre = jugador.nombre 
			? jugador.nombre : jugadores.listaJugadores[indiceJugadorActualizar].nombre;
		jugadores.listaJugadores[indiceJugadorActualizar].posicion = jugador.posicion
			? jugador.posicion: jugadores.listaJugadores[indiceJugadorActualizar].posicion;
		return res.status(200).json({
			message: "Actualización exitosa",
		});
	} else {
		return res.status(418).json({
			message: "Soy una tetera",
		});
	}
});
