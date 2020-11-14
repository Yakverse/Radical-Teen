import mongoose from 'mongoose'
import auth from '../auth/auth'
import Queue from '../lib/Queue'
const User = mongoose.model('User');
import crypto from 'crypto'

const randomBytesLength = 32;

exports.signin = async (req, res) => {

    // body = {
    //     nome = '',
    //     usuario = '',
    //     email = '',
    //     cel = '',
    //     senha = '',
    // }

    var randomString = crypto.randomBytes(randomBytesLength).toString('hex');

    req.body.emailVerification = randomString;
    req.body.emailVerificationExpires = Date.now() + 7200000; //2h
    req.body.senha = auth.generateHash(req.body.senha)
    req.body.notification = {
        title: "Bem-Vindo(a) ao Radical Teen!",
        text: "Verifique seu email e aproveite os campeonatos!"
    }

    new User(req.body).save().then(message => {
        Queue.add('RegistrationMail', {email: req.body.email, randomString: randomString})

        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${message.id};expires=${date.toUTCString()};path=/;HttpOnly;SameSite=None;Secure`)
        return res.status(200).send({ code: 200, sucess: true, user: message.usuario })
    }).catch(() => {
        return res.status(409).send({ code: 409, sucess: false})
    })
}

exports.emailVerification = async (req, res) => {

    // body = {
    //     token = ''
    // }

    if (req.body.token == undefined) return res.status(400).send()

    User.findOneAndUpdate(
        { emailVerification: req.body.token, emailVerificationExpires: { $gt: Date.now() } },
        { $unset: {emailVerification: req.body.token, emailVerificationExpires: ''}, active: true, $push: {notification: {title: "Email Verificado!", text: "Agora você pode aproveitar de todos os recursos do site!\nCadastre suas contas no seu perfil e se inscreva nos campeonatos dos seus jogos favoritos!"}}}).then((msg) => {
        if (msg == null) return res.status(304).send({ code: 304, sucess: false })
        return res.status(200).send({ code: 200, sucess: true })
    }).catch(() => {
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.reverification = async (req, res) => {

    // header = {sessionID: ''}
    // body = {
    //     email: '' (opcional)
    // }

    User.findById(req.cookies['sessionID']).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send({ code: 404, sucess: false })
        }
        if (data.active) return res.status(304).send({ code: 304, sucess: false })

        randomString = crypto.randomBytes(randomBytesLength).toString('hex');

        if (req.body.email) data.email = req.body.email
        data.emailVerification = randomString
        data.emailVerificationExpires = Date.now() + 7200000; //1h

        User.replaceOne({ _id: req.cookies['sessionID']}, data).then(() => {
            Queue.add('RegistrationMail', {email: data.email, randomString: randomString})
            return res.status(200).send({ code: 200, sucess: true })
        }).catch(() => {
            return res.status(500).send( {code: 500, sucess: false })
        })

    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.login = async (req, res) => {

    // body = {
    //     email: '',
    //     senha: ''
    // }

    User.find({ email: req.body.email }).then(data => {
        if (data.length == 0) return res.status(404).send({ code: 404, sucess: false })
        if (!auth.validPassword(req.body.senha, data[0].senha)) return res.status(401).send({ code: 401, sucess: false })

        var date = new Date();
        date.setDate(date.getDate() + 2);
        res.setHeader('Set-Cookie', `sessionID=${data[0]._id};expires=${date.toUTCString()};path=/;HttpOnly;SameSite=None;Secure`)
        return res.status(200).send({ code: 200, sucess: true, nome: data[0].usuario, active: data[0].active })
    }).catch(() => {
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.logout = (req, res) => {
    res.clearCookie('sessionID', { path: '/' })
    return res.status(200).send()
}

exports.saveAccount = async (req, res) => {

    // header = {sessionID: ''}
    // body = {
    //     userFortnite: '',
    //     userRL: '',
    //     userFifa: '',
    //     userLol: '',
    //     userFF: '',
    //     userSteam: '',
    // }

    if (req.body.nome || req.body.usuario || req.body.email || req.body.cel || req.body.senha || req.body.admin || req.body.active || req.body.emailVerification) return res.status(401).send()
    User.findById({ _id: req.cookies['sessionID'] }).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send()
        }
        if (!data.active) return res.status(401).send()

        User.update({ _id: req.cookies['sessionID']}, {$set: req.body}).then(() => {
            return res.status(201).send()
        }).catch(() => {
            return res.status(400).send()
        })
    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send()
    })
}

exports.userInfo = (req, res) => {

    // header = {sessionID: ''}

    if (!req.cookies['sessionID']) return res.status(204).send({ code: 204, sucess: false })
    User.findById(req.cookies['sessionID'], { _id: 0 }).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send()
        } else {
            data.senha = undefined
            data.emailVerification = undefined
            return res.status(200).send({ code: 200, sucess: true, data })
        }
    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.userAccounts = (req, res) => {
    if (Object.keys(req.query).length == 0) {
        return res.status(400).send()
    }
    User.find({ usuario: req.query.p }, { _id: 0 }).then(data => {
        if (data.length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send()
        } else {
            data[0].email = undefined
            data[0].cel = undefined
            data[0].senha = undefined
            data[0].admin = undefined
            data[0].usuario = undefined
            data[0].emailVerification = undefined
            data[0].active = undefined
            return res.status(200).send(data[0])
        }
    }).catch(() => {
        return res.status(400).send()
    })
}

exports.changePassword = (req, res) => {

    // headers = {sessionID: ''}
    // body = {
    //     senhaAntiga: '',
    //     senhaNova: ''
    // }

    User.findById(req.cookies['sessionID']).then(data => {
        if (data == null || Object.keys(data).length == 0) {
            res.clearCookie('sessionID', { path: '/' })
            return res.status(404).send()
        } else {
            if (!auth.validPassword(req.body.senhaAntiga, data.senha)) return res.status(401).send({ code: 401, sucess: false })

            data.senha = auth.generateHash(req.body.senhaNova)

            User.replaceOne({ _id: req.cookies['sessionID'] }, data).then(() => {
                return res.status(200).send({ code: 200, sucess: true })
            }).catch(() => {
                return res.status(500).send({ code: 500, sucess: false })
            })
        }
    }).catch(() => {
        res.clearCookie('sessionID', { path: '/' })
        return res.status(400).send({ code: 400, sucess: false })
    })
}

exports.forgotPassword = (req, res) => {

    // body = {
    //     email: ''
    // }

    if (req.body.email == undefined) return res.status(400).send()
    User.findOne({ email: req.body.email }).then(data => {
        if (data == null || Object.keys(data).length == 0) return res.status(404).send()

        var randomString = crypto.randomBytes(randomBytesLength).toString('hex');

        data.passwordReset = randomString;
        data.passwordResetExpires = Date.now() + 3600000; //1h

        User.findOneAndUpdate({ email: req.body.email }, data).then(() => {
            Queue.add('ForgotPasswordMail', {email: req.body.email, randomString: randomString})
            return res.status(200).send({ code: 200, sucess: true })
        }).catch(() => {
            return res.status(500).send( {code: 500, sucess: false })
        })
    }).catch(() => {
        return res.status(400).send( {code: 400, sucess: false })
    })
}

exports.confirmPassword = (req, res) => {

    // body = {
    //     token: '',
    //     senhaNova: ''
    // }

    var newPassword = auth.generateHash(req.body.senhaNova)

    User.findOneAndUpdate({ passwordReset: req.body.token, passwordResetExpires: { $gt: Date.now() } },
    { $unset: {passwordReset: req.body.token, passwordResetExpires: ''}, senha: newPassword, $push: { notification: { title: "Senha alterado com sucesso!", text: "Sua senha foi alterado recetemente com sucesso!" } } }).then(msg => {
        if (msg == null) return res.status(304).send({ code: 304, sucess: false })
        res.clearCookie('sessionID', { path: '/' })
        return res.status(200).send({ code: 200, sucess: true })
    }).catch(() => {
        return res.status(400).send({ code: 400, sucess: false })
    })
}