require("dotenv").config();
const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

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
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", (req, res) => {
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "./user.json"));
  let parsedFile = JSON.parse(file);

  // Generar el salt del hash (como una clave de encriptacion)
  bcrypt.genSalt(10, (err, salt) => {
    // Hasheamos el dato en cuestion (textAHashear, clave, callbback() )
    bcrypt.hash(password, salt, (err, hash) => {
      // Reescribimos el objeto .json con nuestro array de datos
      fs.writeFileSync(
        path.join(__dirname, "./user.json"),
        JSON.stringify(
          // Creamos un nuevo objeto dentro del array
          [
            ...parsedFile,
            {
              user,
              password: hash,
            },
          ],
          // no sabemos que hace
          null,
          // Aplica una sangría en cada salto de linea
          2
        )
      );
    });
  });

  res.redirect("/signin");
});

app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

app.post("/signin", (req, res) => {
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "./user.json"));
  let parsedFile = JSON.parse(file);

  // Buscamos si existe el usuario con mismo user
  const existedUser = parsedFile.find((usuario) => usuario.user === user);

  // Si no existe, retornamos invalido
  if (!existedUser) {
    return res.render("invalid.ejs");
  }

  // Comparamos la contraseña recibida con la escrita
  const validPassword = bcrypt.compareSync(password, existedUser.password);

  // Si no son iguales, retornamos invalido
  if (!validPassword) {
    return res.render("invalid.ejs");
  }

  // Si todo salio ok, enviamos al dashboard
  res.render("dashboard.ejs", { user });
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port: ", process.env.PORT);
});
