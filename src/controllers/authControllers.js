const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const sendSigninForm = (req, res) => {
  res.render("signin.ejs");
};

const getSigninData = (req, res) => {
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "../models/user.json"));
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
};

const sendSignupForm = (req, res) => {
  res.render("signup.ejs");
};

const getSignupData = (req, res) => {
  const { user, password } = req.body;

  // Obtenemos el archivo con los usuarios existentes
  const file = fs.readFileSync(path.join(__dirname, "../models/user.json"));
  let parsedFile = JSON.parse(file);

  // Generar el salt del hash (como una clave de encriptacion)
  bcrypt.genSalt(10, (err, salt) => {
    // Hasheamos el dato en cuestion (textAHashear, clave, callbback() )
    bcrypt.hash(password, salt, (err, hash) => {
      // Reescribimos el objeto .json con nuestro array de datos
      fs.writeFileSync(
        path.join(__dirname, "../models/user.json"),
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
};

module.exports = {
  sendSigninForm,
  getSigninData,
  sendSignupForm,
  getSignupData,
};
