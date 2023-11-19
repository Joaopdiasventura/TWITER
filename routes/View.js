import { Router, application } from "express";
import Categoria from "../models/Categoria.js"
import Postagem from "../models/Postagem.js";

const view = Router();

view.get("/user", (req, res) =>{
    res.send(req.user);
})

view.get("/categorias", (req, res) => {
    Categoria.find().sort({ date: "desc" }).then((categorias) => {
        res.render("categorias", {categorias: categorias, user: req.user})
    });
});


view.get("/postagens", (req, res) => {
    Postagem.find().sort({ date: "desc" }).then((postagens) => {
        res.render("postagens", { user: req.user, postagens: postagens });
    });    
});

view.post("/categorias", async (req, res) => {

        const novaCategoria = new Categoria({
            name: req.body.name,
            slug: req.body.slug
        });

        try {
            await novaCategoria.save();
            res.redirect("/categorias");
        } catch (erro) {
            console.log(erro);
            res.send(erro)
        }
    
});

view.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        Postagem.find({categoria: categoria._id}).populate({path: 'categorias', strictPopulate: false}).sort({ date: "desc" }).then((postagens) => { 
            res.render("cpostagens", {postagens: postagens, user: req.user});
        }).catch();
    })

});

view.post("/postagens", async (req, res) => {


    const novaPostagem = new Postagem({
        name: req.body.name,
        slug: req.body.slug,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria

    });

    Postagem.findOne({slug: novaPostagem.slug}).then( async (postagem) => {
        if (postagem) {
            Categoria.find().then((categorias) => {
                res.render("addpostagens", {erro: "Essa postagem já existe", categorias: categorias})
            })
        }
        else{
            try {
                await novaPostagem.save();
                res.redirect("/postagens")
            } catch (erro) {
                res.send(erro)
            }
        }
    })
});

view.post("/postagem/del/:id", (req, res) => {
    Postagem.deleteOne({ _id: req.params.id }).then(()=>{
        Postagem.find().populate({path: 'categorias', strictPopulate: false}).sort({ date: "desc" }).then((postagens) => {
            res.redirect("/postagens");
        });
    });
});

view.post("/categoria/del/:id", (req, res) => {
    Categoria.deleteOne({ _id: req.params.id }).then(() => {
        return Postagem.deleteMany({ categoria: req.params.id });
    }).then(() => {
        res.redirect("/categorias");
    })
});

view.get("/postagens/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).populate({path: 'categorias', strictPopulate: false}).then((postagem) => {
        Categoria.findOne({_id: postagem.categoria}).then((categoria) => {
            res.render("postagem", {postagem: postagem,categoria: categoria, user: req.user});
        })
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("An error occurred");
        });
});

view.get("/add/postagens", (req, res) => {    
    Categoria.find().sort({ date: "desc" }).then((categorias) => {
        res.render("addpostagens", {categorias: categorias, user: req.user});
    })
});

view.get("/add/categorias", (req, res) => {    
    res.render("addcategorias", {user: req.user});
});

view.get("/edit/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).then((postagem) => {
        Categoria.find().then((categoria) => {
            res.render("editpostagens", {user: req.user, postagem: postagem, categoria: categoria})
        })
    })
})

view.get("/edit/categoria/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).then((categoria) => {
        res.render("editcategorias", {categoria: categoria, user: req.user})
    })
})

view.post("/edit/postagem/:slug", async (req, res) => {
    try {
        await Postagem.findOneAndUpdate({slug: req.params.slug}, {
            name: req.body.name,
            slug: req.body.slug,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        });
        res.redirect("/postagens");
    } catch (error) {
        console.error(error);
        res.status(500).send("Erro ao editar a postagem");
    }
});

view.post("/edit/categoria/:slug", async (req, res) => {
    try{
        await Categoria.findOneAndUpdate({slug: req.params.slug}, {
            name: req.body.name,
            slug: req.body.slug
        });
        res.redirect("/categorias");
    } catch (erro){
        console.error(error);
        res.status(500).send("Erro ao editar a categoria");
    }
});

export default view;
