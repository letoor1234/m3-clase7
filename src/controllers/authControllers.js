const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const sendSigninForm = (req, res) => {
  console.log("get /signin");
  res.render("signin.ejs");
};

const getSigninData = (req, res) => {
  console.log("post /signin");
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "../models/user.json"));
  let parsedFile = JSON.parse(file);

  // Buscamos si existe el usuario con mismo user
  const existedUser = parsedFile.find((current) => current.user === user);

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

  req.session.userId = existedUser.id;
  req.session.save();

  // Si todo salio ok, enviamos al dashboard
  res.redirect("/");
};

const sendSignupForm = (req, res) => {
  console.log("get /signup");
  res.render("signup.ejs");
};

const getSignupData = (req, res) => {
  console.log("post /signup");
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "../models/user.json"));
  let parsedFile = JSON.parse(file);

  // Verificar si ya existe
  const existedUser = parsedFile.some((current) => current.user === user);
  if (existedUser) {
    return res.send("El usuario ya existe!!!!");
  }

  // Generar el salt del hash (como una clave de encriptacion)
  bcrypt.genSalt(10, (err, salt) => {
    // Hasheamos el dato en cuestion (textAHashear, clave, callbback() )
    bcrypt.hash(password, salt, (err, hash) => {
      const id = crypto.randomUUID();
      const newUser = {
        id,
        user,
        password: hash,
      };
      req.session.userId = id;
      req.session.save();

      // Reescribimos el objeto .json con nuestro array de datos
      fs.writeFileSync(
        path.join(__dirname, "../models/user.json"),
        JSON.stringify(
          // Creamos un nuevo objeto dentro del array
          [...parsedFile, newUser],
          // no sabemos que hace
          null,
          // Aplica una sangría en cada salto de linea
          2
        )
      );
    });
  });

  res.redirect("/");
};

const signOut = (req, res) => {
  console.log("get /signout");
  req.session.destroy();

  res.redirect("/signin");
};

module.exports = {
  sendSigninForm,
  getSigninData,
  sendSignupForm,
  getSignupData,
  signOut,
};
