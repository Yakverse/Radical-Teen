$(document).ready(function() {
    var images = ['img/csgo.jpg', 'img/fortnite.jpg', 'img/freefire.jpg', 'img/fifa.jpg', 'img/lol.jpg', 'img/fifamobile.jpg']
    var image1 = images[Math.floor(Math.random() * images.length)]
    var image2 = images[Math.floor(Math.random() * images.length)]
    var image3 = images[Math.floor(Math.random() * images.length)]

    while(true){
        if(image1 != image2 && image1 != image3 && image2 != image3){
            break
        }
        else if(image2 != image3){
            image2 = images[Math.floor(Math.random() * images.length)]
        }
        else{
            image3 = images[Math.floor(Math.random() * images.length)]
        }
    }

    $('#fundoJogo1').append('<style>#fundoJogo1{background: url(' + image1 + ') no-repeat center / cover}')
    $('#fundoJogo2').append('<style>#fundoJogo2{background: url(' + image2 + ') no-repeat center / cover}')
    $('#fundoJogo3').append('<style>#fundoJogo3{background: url(' + image3 + ') no-repeat center / cover}')

})
