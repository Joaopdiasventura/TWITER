import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import bodyParser from "body-parser";
import admin from "./routes/Admin.js";
import logar from "./config/Auth.js";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash/lib/flash.js";
import view from "./routes/View.js";

const app = express(); 

const port = process.env.PORT || 3000;

const handle = handlebars.create({ 
  defaultLayout: 'main',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.use(session({
    secret: 'Jpplay2_0',
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.succsess_msg = req.flash("succsess_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error"); 
  res.locals.users = req.user || null;
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.use(express.static('public'));
app.engine('handlebars', handle.engine);
app.set('view engine', 'handlebars');

logar(passport);

app.use(admin);
app.use(view);

const mongoDBURI = "mongodb+srv://joaopdiasventura:Jpplay2_0@cluster0.7i4iw97.mongodb.net/twiter";

mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Conexão com o MongoDB Atlas estabelecida com sucesso.");
    app.listen(port, () => {
      console.log(`SERVIDOR RODANDO NA PORTA ${port}`);
    });
  })
  .catch((error) => {
    console.error("Erro na conexão com o MongoDB:", error);
  });
