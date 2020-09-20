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
const user = $.getUrlVars()['p']

infoUser = async () => {
    await fetch(`${URL_API}/user?p=${user}`, {
        credentials: 'include',
        method: 'GET'
    }).then(async response => {
        if (response.status == 404) {
            document.getElementById('perfilNaoEncontrado').innerHTML = '<h2>PERFIL NÃO ENCONTRADO</h2>'
            return
        } else if (response.status == 400) return window.location.href = 'index.html'

        var data = await response.json()
        document.getElementById('outputNome').innerHTML = `${data.nome}`

        var accounts = ['userFortnite', 'userRL', 'userFifa', 'userLol', 'userFF', 'userSteam']
        var jogosCadastrados = ''

        accounts.forEach((value) => {
            if (data[value]) {
                jogosCadastrados += `
                <div class="jogoCampoPerfil">
                    <img src="img/${value}.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data[value]}</p>
                </div>
                `
            }
        })

        document.getElementById('jogosPerfil').innerHTML = jogosCadastrados

        await fetch(`${URL_API}/user/info`, {
            credentials: 'include',
            method: 'POST',
            headers: { "Content-Type": "application/json; charset=UTF-8" }
        }).then(async responseVerif => {
            if (responseVerif.status == 400 || responseVerif.status == 404) {
                if (sessionStorage.getItem('sessionName')) sessionStorage.removeItem('sessionName')
                window.location.href = 'index.html'
            } else if (responseVerif.status == 200) {
                var dataVerif = await responseVerif.json()
                if (sessionStorage.getItem('sessionName').replace(/\"/g, "") != dataVerif.data.usuario) {
                    sessionStorage.removeItem('sessionName')
                    window.location.href = 'index.html'
                } else if (dataVerif.data.usuario == user) document.getElementById('botaoEdit').style.display = ''
            }
        })

        document.getElementById('botaoEdit').addEventListener('click', () => {
            document.getElementById('jogosPerfil').innerHTML = `
                <div class="jogoCampoPerfil">
                    <img src="img/userFortnite.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userFortnite || ''}" id="inputFortnite" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
                <div class="jogoCampoPerfil">
                    <img src="img/userRL.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userRL || ''}" id="inputRL" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
                <div class="jogoCampoPerfil">
                    <img src="img/userFifa.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userFifa || ''}" id="inputFifa" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
                <div class="jogoCampoPerfil">
                    <img src="img/userLol.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userLol || ''}" id="inputLoL" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
                <div class="jogoCampoPerfil">
                    <img src="img/userFF.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userFF || ''}" id="inputFF" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
                <div class="jogoCampoPerfil">
                    <img src="img/userSteam.png" class="iconeJogoPerfil">
                    <input type="text" class="jogoPerfilEdit" value="${data.userSteam || ''}" id="inputSteam" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"><i class="jogoEditIcon fas fa-pencil-alt"></i>
                </div>
            `
        })
    })
}
infoUser()

document.getElementById('btnSubmit').addEventListener('click', async () => {
    var payload = JSON.stringify({
        userType: ['fortnite', 'rl', 'fifa', 'lol', 'ff', 'steam'],
        account: [document.getElementById('inputFortnite').value, document.getElementById('inputRL').value, document.getElementById('inputFifa').value, document.getElementById('inputLoL').value, document.getElementById('inputFF').value, document.getElementById('inputSteam').value]
    })
    await fetch(`${URL_API}/user/account`, {
        credentials: 'include',
        method: 'PUT',
        body: payload,
        headers: { "Content-Type": "application/json; charset=UTF-8" }
    }).then(response => {
        if (response.status == 404 || response.status == 400) {
            if (sessionStorage.getItem('sessionName')) sessionStorage.removeItem('sessionName')
            window.location.href = 'index.html'
        }
        if (response.ok) window.location.reload()
        else {
            $("#toast").toast({
                type: 'error',
                message: 'Erro'
            });
        }
    })
})