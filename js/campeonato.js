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
const campType = $.getUrlVars()['j']
const id = $.getUrlVars()['id']

verifyLogin = async (campInscricao) => {
    if (sessionStorage.getItem('activeEmail') == 'false') return $("#toast").toast({ type: 'error', message: 'Verifique seu email antes!' })
    await fetch(`${URL_API}/user/info`, {
        credentials: 'include',
        method: 'POST'
    }).then(async response => {
        if (response.status == 204) window.location.href = 'login.html'
        else if (response.status != 200) window.location.reload(true)
        else window.location.href = `pagamento.html?c=${id}&i=${campInscricao}&t=${campType}`
    })
}

loadCamp = async () => {
    document.getElementById('imagemCampeonato').innerHTML = `<img src="img/${campType}banner.png">`
    await fetch(`${URL_API}/camp?id=${id}`, {
        credentials: 'include',
        method: 'GET'
    }).then(async response => {
        if (response.status != 200) window.location.href = 'index.html';
        else {
            var data = await response.json()
            document.getElementById('tituloCampeonato').innerHTML = `<h2>${data.nome}</h2>`
            document.getElementById('valorPremiacao').innerHTML = data.premiacao
            document.getElementById('valorInscricao').innerHTML = data.inscricao
            document.getElementById('conteudoInfo').innerHTML += `<p>${data.info || '<br>Ainda sem informações'}</p>`
            document.getElementById('conteudoRegras').innerHTML += `<p>${data.regras || 'Sem regras'}</p>`

            var table = document.getElementById('table')
            if (data.listaPlayers.length == 0) table.innerHTML += `<tr><td>Sem participantes</td></tr>`
            else {
                data['listaPlayers'].forEach(element => {
                    table.innerHTML += `<tr><td>${element}</td></tr>`
                });
            }
            document.getElementById('botaoInscreverse').setAttribute('onclick', `verifyLogin(${data.inscricao})`)
        }
    })
}

loadCamp()