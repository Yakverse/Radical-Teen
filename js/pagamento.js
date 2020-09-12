const URL_API = 'https://api.radicalteen.com.br'

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

confirmaIncricao = async () => {
    var payload = JSON.stringify({campID: $.getUrlVars()['c']})
    await fetch(`${URL_API}/inscrever`, {
        credentials: 'include',
        method: 'POST',
        body: payload,
        headers: {"Content-Type": "application/json; charset=UTF-8"}
    }).then(response => {
        if (response.status == 409) window.alert('Você já está cadastrado!')
        else if (response.status != 200) window.location.href = document.referrer
        else {
            window.alert('Pagamento em análise.')
            window.location.href = 'index.html'
        }
    })
}

document.getElementById('nomeOutput').innerHTML = sessionStorage.getItem('sessionName').replace(/\"/g, "")
document.getElementById('inscricaoOutput').innerHTML = `R$ ${$.getUrlVars()['i']}`
$('body').append(`<style>body{background: linear-gradient(90deg, rgba(6, 28, 51, 1), rgba(0,0,0,0)), url(img/${$.getUrlVars()['t']}.jpg) no-repeat center / cover}`)