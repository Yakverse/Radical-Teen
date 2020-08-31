$(document).ready(function(){
    var bloco = $(".bloco")
    var seta = $(".return")
    var home = $(".home")
    var main = $("main")
    var titulo = $(".titulo")
    var pagamento = $(".pagamento")
    var mensagem = $(".mensagem")
    var barra = $(".barra")
    var conteudoBarra = $(".conteudoBarra")
    var fecharBarra = $(".fecharBarra")
    var pagamentoOpcao = $(".pagamentoOpcao")
    
    // Barra
    barra.click(function(){
        conteudoBarra.toggle("fast")
    });
    fecharBarra.click(function(){
        conteudoBarra.toggle("fast")
    });
    

    // Paginas
    bloco.click(function(){
        var main = $("main")
        var titulo = $(".titulo")
        var pagamento = $(".pagamento")
        if($( this ).hasClass("naoDisponivel")){
            mensagem.fadeIn(300, function(){
                window.setTimeout(function(){
                    mensagem.fadeOut()
                }, 6000)
            })

        }
        else{
            $('.blocoImgDiv', this).hide()
            $('.textBloco', this).show()
        }
        // else{
        //     bloco.hide()
        //     home.hide()
        //     seta.show()
        //     pagamento.show()
        //     if(this.id == "fortnite"){
        //         main.attr("id", "fortnite")
        //         titulo.text("fortnite");
        //         $(".pagamentoData").text("Data Fort")
        //     }
        //     else if(this.id == "fifa"){
        //         main.attr("id", "fifa")
        //         titulo.text("fifa");
        //         $(".pagamentoData").text("Data Fifa")
        //     }
        //     else if(this.id == "csgo"){
        //         main.attr("id", "csgo")
        //         titulo.text("cs:go");
        //         $(".pagamentoData").text("Data")
        //     }
        //     else if(this.id == "freefire"){
        //         main.attr("id", "freefire")
        //         titulo.text("free fire");
        //         $(".pagamentoData").text("Data")
        //     }
        //     else if(this.id == "lol"){
        //         main.attr("id", "lol")
        //         titulo.text("League Of Legends");
        //         $(".pagamentoData").text("Data")
        //     }
        //     else if(this.id == "rocketleague"){
        //         main.attr("id", "rocketleague")
        //         titulo.text("rocket league");
        //         $(".pagamentoData").text("Data")
        //     }
        // }
    });
    // Pagamento
    // $("#botaoPagar").click(function(){
    //     $(".pagamentoInicio").hide()
    //     $(".opcoesPagamento").show()
    //     $(".pagamentoTitulo").show()
    //     $(".pagamentoData").hide()
    //     seta.addClass("opcoesPgt")
    // });
    // pagamentoOpcao.click(function(){
    //     if($(this).attr("id") === "nubank"){
    //         $(".pagamentoNubank").show()
    //         $(".pagamentoTitulo").text("Nubank");
    //     }
    //     else if($(this).attr("id") === "paypal"){
    //         $(".pagamentoPaypal").show()
    //         $(".pagamentoTitulo").text("PayPal");
    //     }
    //     else if($(this).attr("id") === "mercadopago"){
    //         $(".pagamentoMercadopago").show()
    //         $(".pagamentoTitulo").text("Mercado Pago");
    //     }
    //     else if($(this).attr("id") === "picpay"){
    //         $(".pagamentoPicPay").show()
    //         $(".pagamentoTitulo").text("Pic Pay");
    //     }
    //     $(".opcoesPagamento").hide()
    //     seta.removeClass("opcoesPgt")
    //     seta.addClass("pagando")
    // });

    // seta.click(function(){
    //     if(seta.hasClass("opcoesPgt")){
    //         $(".pagamentoInicio").show()
    //         seta.removeClass("opcoesPgt")
    //         $(".pagamentoTitulo").hide()
    //         $(".pagamentoData").show()
    //         $(".opcoesPagamento").hide()
    //     }
    //     else if(seta.hasClass("pagando")){
    //         $(".opcoesPagamento").show()
    //         seta.removeClass("pagando")
    //         $(".pagamentoTitulo").text("Selecione a Forma de Pagamento");
    //         $(".pagamentos").hide()
    //         seta.addClass("opcoesPgt")
    //         seta.removeClass("pagando")
    //     }
    //     else{
    //         seta.hide()
    //         pagamento.hide()
    //         main.removeAttr("id")
    //         titulo.text("Selecione Um Jogo")
    //         home.show()
    //         bloco.show()
    //     }
    // });
});