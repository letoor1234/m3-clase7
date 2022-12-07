require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// Procedemos con las configuraciones de nuestro app
// Manejo de req.body en formato JSON
app.use(bodyParser.urlencoded({ extended: true }));
// Configuracion de motor de vistas
app.use(express.static(path.join(__dirname, "../public")));
app.set("view engine", "ejs");
// Configuracion de sesiones y cookies
app.use(
  session({
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());

// Creamos nuestras rutas
const authRoutes = require("./routes/auth");
app.use("/", authRoutes);


// Ponemos en funcionamiento nuestra aplicación
app.listen(process.env.PORT, () => {
  console.log("Server is running on port: ", process.env.PORT);
});
