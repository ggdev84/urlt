
document.addEventListener("DOMContentLoaded",()=>{

    // On récupère ci-dessous les élements.
    var button = document.getElementById("conditions");
    button.addEventListener("click",()=>{
        alert("Do not use bus.cc to redirect to websites that host illegal content. We are not responsible for any misuse.");
    });

    var shortenbtn = document.getElementById("shorten");
    var url = document.getElementById("url");


// Listener qui permet de gérer le click sur le bouton pour raccourcir l'URL.
    shortenbtn.addEventListener("click",()=>{
        let url1 = url.value;
        let url2 = encodeURIComponent(url1);
        // Contrairement aux projets React, j'ai utilisé XMLHttpRequest et non pas fetch, pour montrer que je sais également l'utiliser.
        var xhr = new XMLHttpRequest(); // Permet de lancer une requête AJAX.
        xhr.onreadystatechange = ()=>{
            if(this.readyState == 4 && this.status == 200){
                url.value = this.responseText;
                url.select();
                document.execCommand("copy"); // Une fois qu'on a reçu l'URL raccourci, on le copie automatiquement dans le presse-papier de l'utilisateur.
            }
        }
        xhr.open("GET","/create/"+url2,true);
        xhr.send(null);
    });

    // Listener qui permet de gérer la touche Entrer.
    url.addEventListener("keyup",function(event){
        if(event.keyCode == 13){
            event.preventDefault();
            shortenbtn.click();
        }
    });
});