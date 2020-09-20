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

const campID = $.getUrlVars()['c']

document.getElementById('excluirCampeonato').addEventListener('click', async () => {
    if (confirm(`Deseja deletar o campeonato ${document.getElementById('nomeCamp').value}?`)) {
        var payload = JSON.stringify({ campID: campID })
        await fetch(`${URL_API}/delete-camp`, {
            credentials: 'include',
            method: 'DELETE',
            body: payload,
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        }).then(response => {
            if (!response.ok) window.location.href = 'index.html'
            window.location.reload(true)
        })
    }
})

document.getElementById('adicionarCampeonato').addEventListener('click', async () => {
    var nomeCamp = document.getElementById('nomeCamp').value
    var tipoCamp = document.getElementById('tipoCamp').value
    var maxCamp = document.getElementById('maxCamp').value
    var dataCamp = document.getElementById('dataCamp').value
    var horaCamp = document.getElementById('horaCamp').value
    var dataLimiteCamp = document.getElementById('dataLimiteCamp').value
    var premiacaoCamp = document.getElementById('premiacaoCamp').value
    var inscricaoCamp = document.getElementById('inscricaoCamp').value

    var payload = JSON.stringify({
        campID: campID,
        campProp: ["nome", "data", "hora", "maxPlayers", "limiteDataInscrições", "premiacao", "inscricao", "campType"],
        info: [nomeCamp, dataCamp, horaCamp, maxCamp, dataLimiteCamp, premiacaoCamp, inscricaoCamp, tipoCamp]
    })

    await fetch(`${URL_API}/edit-camp`, {
        credentials: 'include',
        method: 'PUT',
        body: payload,
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        if (response.status != 201) {
            $("#toast").toast({
                type: 'error',
                message: 'Erro',
                href: 'admin.html'
            })
        } else {
            window.location.reload(true)
        }
    })
})

loadCamp = async () => {
    await fetch(`${URL_API}/camp-admin`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify({ campID: campID }),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(async response => {
        if (response.status == 404) window.location.href = 'index.html'
        if (response.status == 400) window.location.href = 'admin.html'

        var data = await response.json()
        document.getElementById('nomeCamp').value = data.nome
        document.getElementById('tipoCamp').value = data.campType
        document.getElementById('maxCamp').value = data.maxPlayers
        document.getElementById('dataCamp').value = data.data
        document.getElementById('horaCamp').value = data.hora
        document.getElementById('dataLimiteCamp').value = data.limiteDataInscricoes
        document.getElementById('premiacaoCamp').value = data.premiacao
        document.getElementById('inscricaoCamp').value = data.inscricao
    })
}
loadCamp()