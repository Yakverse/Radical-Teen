$(document).ready(function(){
    var botaoInfo = $(".botaoInfo")
    var mensagemInfo = $(".mensagemInfo")
    var closeInfo = $(".closeInfo")

    botaoInfo.click(function(){
        mensagemInfo.show()
    })
    closeInfo.click(function(){
        mensagemInfo.hide()
    })
});