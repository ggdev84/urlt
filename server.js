var express = require("express");
var app = express();
var http = require("http");
var mysql = require("mysql");

var server = http.createServer(app);
server.listen(8080);

// Fonction qui renvoie une chaîne de caractères aléatoires d'une longueur donnée.
var randomString = (length)=> {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};

// Fonction qui créé et renvoie une connexion MySQL.
var create_conn = ()=>{
    var conn = mysql.createConnection({
        host:"localhost",
        user:"root",
        password :"$rootGrkm200",
        database:"shortener"
    });
    return conn;
};

// Toutes les fonctions ci-dessous permettent de renvoyer les pages et images utiles au site.
app.get("/",(req,res)=>{
    res.status(200).sendFile(__dirname + "/index.html");
});

app.get("/index",(req,res)=>{
    res.status(200).sendFile(__dirname + "/index.html");
});

app.get("/index.js",(req,res)=>{
    res.status(200).sendFile(__dirname + "/index.js");
});

app.get("/Pacifico.ttf",(req,res)=>{
    res.status(200).sendFile(__dirname + "/Pacifico.ttf");

});

app.get("/style.css",(req,res)=>{
    res.status(200).sendFile(__dirname + "/style.css");
});

/* La fonction ci-dessous permet de créer un URL. 
Une chaîne de longueur de 5 caractères est crée et l'URL de base est mis dans la base de donnée.
Un URL est pris en paramètre.*/
app.get("/create/:url",(req,res)=>{

    let conn = create_conn();
    let urlbase = randomString(5);
    var request = "INSERT INTO url(shortenedurl,realurl) VALUES(\"" + urlbase + "\",\"" + req.params.url+"\");";
    conn.query(request,(err,result)=>{
        if(err){console.log(err)}
        else{
            if (err) throw err;
            res.setHeader("Content-Type","text/plain");
            res.status(200).send("bus.cc/"+urlbase);
        }
    });
});

/* Ici, on redirige simplement l'utilisateur vers le réel lien non réduit.
Pour ça, on prend en paramètre un URL raccourci, on cherche dans la base de donnée le vrai URL correspondant,
et on redirige l'utilisateur.
*/

app.get("/:shortenedurl",(req,res)=>{
    let conn = create_conn();
    let request = "SELECT realurl FROM url WHERE shortenedurl=\"" + req.params.shortenedurl + "\";";
    conn.query(request,(err,result)=>{
        if(err){console.log(err)}
        else{
            if(result != ""){
                let realurl = result[0].realurl;
                realurl = decodeURIComponent(realurl);
                if(realurl.startsWith("http://") || realurl.startsWith("https://")){
                    res.redirect(realurl);
                }
                else{
                    res.redirect("http://" + realurl);
                }
            }
            else{
                res.setHeader("Content-Type","text/html");
                res.status(404).send("Page not found");
            }
        }
    });
});