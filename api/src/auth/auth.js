const bcrypt = require('bcrypt')

exports.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

exports.validPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}