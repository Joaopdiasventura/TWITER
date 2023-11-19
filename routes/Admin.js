import { Router } from "express";
import bcrypt from "bcrypt";
import passport from "passport";
import User from "../models/User.js";
import LocalStrategy from "passport-local";
import nodemailer from "nodemailer";

const admin = Router();

let enviado = false;
let correto = false;
let cod;

admin.get("/", async (req, res) => {
    res.render("index", { user: req.user });
})

admin.get("/registro", (req, res) => {
    enviado = false;
    correto = false;
    res.render("registro", { user: req.user, correto: correto, enviado: enviado });
});

admin.get("/login", (req, res) => {
    res.render("login", { user: req.user })
});

admin.post("/registro", async (req, res) => {
    try {
        const { name, email, senha, senha2 } = req.body;
        const erros = [];

        if (senha === senha2) {
            const usuarioExistente = await User.findOne({ email });
            if (usuarioExistente) {
                erros.push({ texto: "EMAIL REGISTRADO NO SISTEMA... TENTE OUTRO" });
                res.render("registro", { erros: erros })
            } else {
                const novoUsuario = new User({
                    name,
                    email,
                    senha
                });

                bcrypt.genSalt(10, (erro, salt) => {
                    if (erro) {
                        res.send(erro);
                        throw erro;
                    }
                    bcrypt.hash(novoUsuario.senha, salt, async (erro, hash) => {
                        if (erro) {
                            res.send(erro);
                            throw erro;
                        }

                        novoUsuario.senha = hash;
                        await novoUsuario.save();
                        console.log("Usuário registrado");
                        res.redirect("/login")
                    });
                });
            }
        } else {
            erros.push({ texto: "SENHAS DIFERENTES" });
            correto = true;
            enviado = true;
            res.render("registro", { erros: erros, user: req.user, correto: correto, enviado: enviado  })
        }
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).send("Erro no servidor" + erro);
    }
});

admin.post("/enviar", async (req, res) => {
    const erros = [];

    const usuarioExistente = await User.findOne({ email: req.body.email });
    if (usuarioExistente) {
        erros.push({ texto: "EMAIL REGISTRADO NO SISTEMA... TENTE OUTRO" });
        res.render("registro", { erros: erros })
    } else {
        cod = (Math.random() * 999).toFixed(0);
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'jpplayrucoy@gmail.com',
                pass: 'fwkg dkgg bigp ufqw',
            },
        });

        const mailOptions = {
            from: 'jpplayrucoy@gmail.com',
            to: req.body.email,
            subject: 'CÓDIGO DE REGISTRO PARA O SITE DO VULGO JP',
            text: cod,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Erro ao enviar o e-mail: ' + error);
            } else {
                enviado = true;
                res.render("registro", { enviado: enviado, correto: correto });
            }
        });
    }
});

admin.post("/conferir", (req, res) => {
    if (cod == req.body.codigo) {
        correto = true;
        res.render("registro", { enviado: enviado, correto: correto })
    }
});

admin.post("/login", async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (!user) {
            console.error(info);
            return res.render("login", { erros: info });
        }
        req.logIn(user, (err) => {
            if (err) {
                console.error(err);
                return res.render("login", { erros: err });
            }
            return res.redirect("/");
        });
    })(req, res, next);
});

admin.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    });
});

export default admin;