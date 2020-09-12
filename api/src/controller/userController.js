const mongoose = require('mongoose');
const auth = require('../auth/auth');
const User = mongoose.model('User');

exports.signin = async (req, res, next) => {

    // body = {
    //     nome = '',
    //     usuario = '',
    //     email = '',
    //     cel = '',
    //     senha = '',
    // }

    req.body.senha = auth.generateHash(req.body.senha)

    new User(req.body).save().then(message => {
        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${message.id};expires=${date.toUTCString()};path=/; HttpOnly; SameSite=None`)
        res.status(200).send({code: 200, sucess: true, user: message.usuario})
    }).catch(error => {
        res.status(409).send({code: 409, sucess: false, error: error})
    })
}

exports.login = async (req, res, next) => {

    // body = {
    //     email: '',
    //     senha: ''
    // }

    User.find({email: req.body.email}).then(data => {
        if (data.length == 0) return res.status(404).send({code: 404, sucess: false})
        if (!auth.validPassword(req.body.senha, data[0].senha)) return res.status(401).send({code: 401, sucess: false})

        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${data[0]._id};expires=${date.toUTCString()};path=/; HttpOnly; SameSite=None`)
        res.status(200).send({code: 200, sucess: true, nome: data[0].usuario})
    }).catch(() => {
        res.status(400).send({code: 400, sucess: false})
    })
}

exports.logout = (req, res, next) => {
    res.clearCookie('sessionID', {path: '/'})
    res.status(200).send()
}

exports.saveAccount = async (req, res, next) => {

    // header = {sessionID: ''}
    // body = {
    //     userType: [''],
    //     account: ['']
    // }

    User.findById(req.cookies['sessionID']).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            res.status(404).send()
        }
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
        
        req.body.userType.forEach((value, i) => {
            userTypes[value](req.body.account[i])
        })
        User.replaceOne({_id: req.cookies['sessionID']}, data).then(() => {
            res.status(201).send()
        }).catch(() => {
            res.status(500).send()
        })
    }).catch(() => {
        res.clearCookie('sessionID', {path: '/'})
        res.status(400).send()
    })
}

exports.userInfo = (req, res, next) => {

    // header = {sessionID: ''}

    if (!req.cookies['sessionID']) return res.status(204).send({code: 204, sucess: false})
    User.findById(req.cookies['sessionID'], {_id: 0}).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            res.status(404).send({code: 404, sucess: false})
        } else {
            data.senha = undefined
            res.status(200).send({code: 200, sucess: true, data})
        }
    }).catch(() => {
        res.clearCookie('sessionID', {path: '/'})
        res.status(400).send({code: 400, sucess: false})
    })
}

exports.userAccounts = (req, res, next) => {
    if (Object.keys(req.query).length == 0) {
        res.status(400).send()
        return
    }
    User.find({usuario: req.query.p}, {_id: 0}).then(data => {
        if (data.length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            res.status(404).send()
        } else {
            data[0].email = undefined
            data[0].cel = undefined
            data[0].senha = undefined
            data[0].admin = undefined
            data[0].usuario = undefined
            res.status(200).send(data[0])
        }
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

    User.findById(req.cookies['sessionID']).then(data => {
        if (Object.keys(data).length == 0) {
            res.clearCookie('sessionID', {path: '/'})
            res.status(404).send()
        } else {
            if (!auth.validPassword(req.body.senhaAntiga, data.senha)) return res.status(401).send({code: 401, sucess: false})

            data.senha = auth.generateHash(req.body.senhaNova)
            
            User.replaceOne({_id: req.cookies['sessionID']}, data).then(() => {
                return res.status(200).send({code: 200, sucess: true})
            }).catch(() => {
                res.status(500).send({code: 500, sucess: false})
            })
        }
    }).catch(() => {
        res.clearCookie('sessionID', {path: '/'})
        res.status(400).send({code: 400, sucess: false})
    })
}