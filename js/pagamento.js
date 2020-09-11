$(document).ready(function() {
    var images = ['img/csgo.jpg', 'img/fortnite.jpg', 'img/freefire.jpg', 'img/fifa.jpg', 'img/lol.jpg', 'img/fifamobile.jpg'];

    $('body').append('<style>body{background: url(' + images[Math.floor(Math.random() * images.length)] + ') no-repeat center / cover}')

})