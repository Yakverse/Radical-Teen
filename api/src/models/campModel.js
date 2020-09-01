const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    nome: {
        type: String,
        required: true
    },
    maxPlayers: {
        type: Number,
        required: false,
        default: 0 //ilimitado
    },
    listaDePlayers: [{
        type: String,
        require: false
    }],
    limiteDataInscrições: {
        type: Date,
        required: false,
        default: 0 //sem limite
    },
    inscricoesOn: {
        type: Boolean,
        required: false,
        default: true
    },
    eventoOn: {
        type: Boolean,
        required: false,
        default: false
    },
    premiacao: {
        type: Number,
        required: true
    },
    inscricao: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Camp', schema);