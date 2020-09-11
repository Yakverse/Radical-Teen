$.extend({
    getUrlVars: function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++){
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
})
document.getElementById('nomeOutput').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
document.getElementById('inscricaoOutput').innerHTML = `R$ ${$.getUrlVars()['i']}`


$(document).ready(function() {
    var images = ['img/csgo.jpg', 'img/fortnite.jpg', 'img/freefire.jpg', 'img/fifa.jpg', 'img/lol.jpg', 'img/fifamobile.jpg']

    $('body').append('<style>body{background: url(' + images[Math.floor(Math.random() * images.length)] + ') no-repeat center / cover}')
})