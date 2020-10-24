const URL_API = 'https://api.radicalteen.com.br'

$.extend({
    getUrlVars: function () {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
})
const code = $.getUrlVars()['v']

verifyEmail = async (code) => {
    await fetch(`${URL_API}/verification`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ code: code }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        if (response.status == 400 || response.status == 304) {
            document.getElementById('loader').style.display = 'none'
            document.getElementById('main').innerHTML += 
            `<div class="emailContent mensagemInserirComprovante animate__animated animate__slideInDown">
                <img class="logoRadical" src="img/icon.png">
                <h1 class="emailTitle">Erro ao confirmar email!</h1>
                <p class="emailText">Link inválido/expirado.</p>
                <a href="index.html"><button class="emailButton"><i class="fas fa-home"></i></button></a>
            </div>`
        } else {
            document.getElementById('loader').style.display = 'none'
            document.getElementById('main').innerHTML += 
            `<div class="emailContent mensagemInserirComprovante animate__animated animate__slideInDown">
                <img class="logoRadical" src="img/icon.png">
                <h1 class="emailTitle">Email Confirmado!</h1>
                <p class="emailText">Bem-Vindo ao Radical Teen! Seu email foi confirmado. Clique no botão abaixo para ser redirecionado para a página principal.</p>
                <a href="index.html"><button class="emailButton"><i class="fas fa-home"></i></button></a>
            </div>`
        }
        sessionStorage.clear()
    })
}
verifyEmail(code)