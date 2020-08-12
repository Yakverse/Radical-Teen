$(document).ready(function(){
    var bloco = $(".bloco")
    var seta = $(".return")
    var home= $(".home")
    var main = $("main")
    var titulo = $(".titulo")
    var pagamento = $(".pagamento")
    var mensagem = $(".mensagem")

    // Paginas
    bloco.click(function(){
        var main = $("main")
        var titulo = $(".titulo")
        var pagamento = $(".pagamento")
        if($( this ).hasClass("naodisponivel")){
            mensagem.fadeIn(300, function(){
                window.setTimeout(function(){
                    mensagem.fadeOut();
                }, 6000);
            });

        }
        else{
            bloco.hide()
            home.hide()
            seta.show()
            pagamento.show()
            if(this.id == "fortnite"){
                main.attr("id", "fortnite")
                titulo.text("fortnite");
            }
            else if(this.id == "fifa"){
                main.attr("id", "fifa")
                titulo.text("fifa");
            }
            else if(this.id == "csgo"){
                main.attr("id", "csgo")
                titulo.text("cs:go");
            }
            else if(this.id == "freefire"){
                main.attr("id", "freefire")
                titulo.text("free fire");
            }
            else if(this.id == "lol"){
                main.attr("id", "lol")
                titulo.text("League Of Legends");
            }
            else if(this.id == "rocketleague"){
                main.attr("id", "rocketleague")
                titulo.text("rocket league");
            }
        }
    });
    seta.click(function(){
        seta.hide()
        pagamento.hide()
        main.removeAttr("id")
        titulo.text("Selecione Um Jogo");
        home.show()
        bloco.show()
    });
});