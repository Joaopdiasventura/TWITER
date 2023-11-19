import bcrypt from "bcrypt";
import passport from "passport";
import mongoose from "mongoose";
import LocalStrategy from "passport-local";

export default function logar() {

const Usuario = mongoose.model("User"); 
  
    passport.use(new LocalStrategy({ usernameField: "email", passwordField: "senha" }, (email, senha, done) => {

        Usuario.findOne({ email: email })
            .then((usuario) => {
                if (!usuario) {
                    return done(null, false, { message: "Essa conta não existe" });
                }

                bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                    if (erro) {
                        return done(erro);
                    }

                    if (batem) {
                        return done(null, usuario);
                    } else {
                        return done(null, false, { message: "Senha incorreta" });
                    }
                });
            })
            .catch((error) => {
                return done(error); 
            });
    }))

    passport.serializeUser((usuario, done) => {
        done(null, usuario);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id)
            .then(user => {
                if (!user) {
                    return done(null, false, { message: "Usuário não encontrado" });
                }
                done(null, user);
            })
            .catch((error) => {
                return done(error);
            });
    });
};

