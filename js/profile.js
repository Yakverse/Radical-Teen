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

const user = $.getUrlVars()['p']

infoUser = async () => {
    var info = await fetch(`${URL_API}/user?p=${user}`, {
        credentials: 'include',
        method: 'GET'
    })
    await info.json().then(data => {
        document.getElementById('outputNome').innerHTML = `${data.nome}`
        document.getElementById('jogosPerfil').innerHTML = `
        <div class="jogoCampoPerfil">
            <img src="img/fortniteicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userFortnite || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userFortnite || ''}" id="inputFortnite"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        <div class="jogoCampoPerfil">
            <img src="img/rocketleagueicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userRL || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userRL || ''}" id="inputRL"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        <div class="jogoCampoPerfil">
            <img src="img/fifaicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userFifa || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userFifa || ''}" id="inputFifa"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        <div class="jogoCampoPerfil">
            <img src="img/lolicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userLol || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userLol || ''}" id="inputLoL"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        <div class="jogoCampoPerfil">
            <img src="img/freefireicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userFF || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userFF || ''}" id="inputFF"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        <div class="jogoCampoPerfil">
            <img src="img/steamicon.png" class="iconeJogoPerfil"><p class="jogoPerfil">${data.userSteam || ''}</p>
            <input type="text" class="jogoPerfilEdit" value="${data.userSteam || ''}" id="inputSteam"><i class="jogoEditIcon fas fa-pencil-alt"></i>
        </div>
        `
    })

    var verif = await fetch(`${URL_API}/user/info`, {
        credentials: 'include',
        method: 'POST',
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    })
    await verif.json().then(dataVerif => {
        if (dataVerif.sucess) {
            if(sessionStorage.getItem('sessionName').replace(/\"/g, "") != dataVerif.data.usuario){
                sessionStorage.removeItem('sessionName')
                window.location.href = 'index.html'
            } else {
                if (dataVerif.data.usuario == user) {
                    document.getElementById('botaoEdit').style.display = ''
                }
            }
        } else {
            if (sessionStorage.getItem('sessionName')){
                sessionStorage.removeItem('sessionName')
            }
            window.location.href = 'index.html'
        }
    }) 
}
infoUser()

document.getElementById('btnSubmit').addEventListener('click', async () => {
    var payload = JSON.stringify({
        userType: ['fortnite', 'rl', 'fifa', 'lol', 'ff', 'steam'],
        account: [document.getElementById('inputFortnite').value, document.getElementById('inputRL').value, document.getElementById('inputFifa').value, document.getElementById('inputLoL').value, document.getElementById('inputFF').value, document.getElementById('inputSteam').value]
    })
    console.log(payload)
    await fetch(`${URL_API}/user/account`, {
        credentials: 'include',
        method: 'PUT',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(response => {
        if (response.ok)  window.location.reload()
        else window.alert('Erro') //TEMP
    })
})