const mongoose = require('mongoose');
const auth = require('../auth/auth');
const User = mongoose.model('User');

exports.signin = async (req, res, next) => {

    // body = {
    //     nome = '',
    //     email = '',
    //     cel = '',
    //     senha = '',
    // }

    if (await verificaCadastroRepetido(req.body.email, req.body.cel)) return res.status(200).send({code: 409, sucess: false, message: 'Cadastro repetido.'})

    req.body.senha = auth.generateHash(req.body.senha)

    new User(req.body).save().then(message => {
        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${message.id};expires=${date.toUTCString()};path=/;HttpOnly`)
        res.status(200).send({code: 200, sucess: true})
    }).catch(error => {
        res.status(400).send({code: 400, sucess: false, error: error})
    })
}

exports.login = async (req, res, next) => {

    // body = {
    //     email: '',
    //     senha: ''
    // }

    User.find({email: req.body.email}).then(data => {
        if (data.length == 0) return res.status(400).send({code: 400, sucess: false})
        if (!auth.validPassword(req.body.senha, data[0].senha)) return res.status(401).send({code: 401, sucess: false})

        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${data[0]._id};expires=${date.toUTCString()};path=/;HttpOnly`)
        res.status(200).send({code: 200, sucess: true})
    })
}

exports.saveAccount = async (req, res, next) => {

    // header = {sessionID: ''}
    // body = {
    //     userType: '',
    //     account: ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        const userTypes = {
            fortnite(account) {
                data.userFortnite = account
            },
            rl(account) {
                data.userRL = account
            },
            fifa(account) {
                data.userFifa = account
            },
            lol(account) {
                data.userLol = account
            },
            ff(account) {
                data.userFF = account
            },
            steam(account) {
                data.userSteam = account
            }
        }
        userTypes[req.body.userType](req.body.account)
        User.replaceOne({_id: req.headers.cookie.split('=')[1]}, data).then(() => {
            res.status(201).send()
        }).catch(() => {
            res.status(500).send()
        })
    }).catch(() => {
        res.status(400).send()
    })
}

exports.changePassword = (req, res, next) => {

    // headers = {sessionID: ''}
    // body = {
    //     senhaAntiga: '',
    //     senhaNova: ''
    // }

    User.findById(req.headers.cookie.split('=')[1]).then(data => {
        if (!auth.validPassword(req.body.senhaAntiga, data.senha)) return res.status(401).send({code: 401, sucess: false})

        data.senha = auth.generateHash(req.body.senhaNova)
        
        User.replaceOne({_id: req.headers.cookie.split('=')[1]}, data).then(() => {
            return res.status(200).send({code: 200, sucess: true})
        }).catch(() => {
            res.status(500).send({code: 500, sucess: false})
        })
    }).catch(() => {
        res.status(400).send({code: 400, sucess: false})
    })
}

verificaCadastroRepetido = async (email, cel) => {
    var dataUserCel = await getUser(null, cel || null);
    var dataUserEmail = await getUser(email || null);

    if (dataUserCel.length !== 0 || dataUserEmail.length !== 0) return true
    else return false
}

getUser = async (email, cel) => {
    if (email) var payload = {email: email}
    else var payload = {cel: cel}

    return new Promise((resolve, rejected) => {
        User.find(payload).then(data => {
            resolve(data)
        }).catch(() => {
            rejected(false)
        })
    })
}