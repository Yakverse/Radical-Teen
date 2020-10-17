var request = require('supertest');
const app = require('../src/app');
const server = require('../bin/server');
const mongoose = require('mongoose');

//Models
const User = require('../src/models/userModel');
const Camp = require('../src/models/campModel');

beforeAll(async done => {
    if (!process.env.MONGO_URL) throw new Error('MongoDB server not initialized')

    mongoose.set('useCreateIndex', true);
    await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    done()
});

afterAll(async () => {
    await User.deleteMany({});
    await Camp.deleteMany({});
    await mongoose.connection.close();
    server.close();
});

describe('Testes de Usuário', () => {
    beforeEach(async () => {
        await User.deleteMany({});
        await Camp.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Camp.deleteMany({});
    });

    describe('Teste de Cadastro', () => {
        test('Cadastro do Usuário', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .expect(200)
                .end((err, res) => {
                    User.find({ usuario: res.body.user }).then(data => {
                        expect(data).toEqual(expect.arrayContaining([
                            expect.objectContaining({
                                nome: 'Teste',
                                usuario: 'teste',
                                email: 'teste@teste.com',
                                cel: '11111111111'
                            })
                        ]))
                    })
                    done()
                })
        })

        test('Cadastro Repetido', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end(() => {
                    request(app).post('/cadastro')
                        .send({
                            nome: 'Teste',
                            usuario: 'teste',
                            email: 'teste@teste.com',
                            cel: '11111111111',
                            senha: 'teste123'
                        }).expect(409, done)
                })
        })
    })

    describe('Testes de Login', () => {
        test('Login do Usuário', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end(() => {
                    request(app).post('/login')
                        .send({
                            email: "teste@teste.com",
                            senha: 'teste123'
                        })
                        .expect(200, done)
                })
        })

        test('Login com senha inválida', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end(() => {
                    request(app).post('/login')
                        .send({
                            email: "teste@teste.com",
                            senha: '123teste'
                        }).expect(401, done)
                })
        })

        test('Login com conta inválida', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end(() => {
                    request(app).post('/login')
                        .send({
                            email: "teste123@teste.com",
                            senha: '123teste'
                        }).expect(404, done)
                })
        })
    })

    describe('Testes para salvar contas', () => {
        var userID
        beforeEach(async done => {
            await User.deleteMany({})
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .expect(200)
                .end((err, res) => {
                    userID = res.headers['set-cookie'][0]
                    done()
                })
        })

        test('Conta salva', done => {
            request(app).put('/user/account')
                .set('Cookie', userID)
                .send({ userSteam: 'steamTest' })
                .expect(201)
                .end(() => {
                    User.findById(userID.split('=')[1].split(';')[0]).then(data => {
                        expect(data).toEqual(expect.objectContaining({ userSteam: 'steamTest' }))
                    })
                    done()
                })
        })

        test('Conta Inexistente', done => {
            request(app).put('/user/account')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({ userType: ['steam'], account: ['steamTest'] })
                .expect(404, done)
        })

        test('SessionID inválido', done => {
            request(app).put('/user/account')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({ userType: ['steam'], account: ['steamTest'] })
                .expect(400, done)
        })
    })

    describe('Teste das informações do usuário', () => {
        var userID
        beforeEach(async done => {
            await User.deleteMany({})
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .expect(200)
                .end((err, res) => {
                    userID = res.headers['set-cookie'][0]
                    done()
                })
        })

        test('Conta válida', done => {
            request(app).post('/user/info')
                .set('Cookie', userID)
                .expect(200, done)
        })

        test('Sem sessionID', done => {
            request(app).post('/user/info').expect(204, done)
        })

        test('SessionID inválido', done => {
            request(app).post('/user/info')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .expect(400, done)
        })
    })

    describe('Testes das contas do usuário', () => {
        test('Busca válida', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end(() => {
                    request(app).get('/user?p=teste')
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body).toEqual(expect.objectContaining({ nome: 'Teste' }))
                            done()
                        })
                })
        })

        test('Busca sem query', done => {
            request(app).get('/user')
                .expect(400, done)
        })

        test('Busca com usuário inexistente', done => {
            request(app).get('/user?p=userinexistente')
                .expect(404, done)
        })
    })

    describe('Testes de mudança de senha', () => {
        test('Mudança de senha com sucesso', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end((err, res) => {
                    request(app).post('/user/change-password')
                        .set('Cookie', res.headers['set-cookie'][0])
                        .send({ senhaAntiga: 'teste123', senhaNova: '123teste' })
                        .expect(200)
                        .end(() => {
                            request(app).post('/login')
                                .send({ email: "teste@teste.com", senha: "123teste" })
                                .expect(200, done)
                        })
                })
        })

        test('Mudança de senha com conta inexistente', done => {
            request(app).post('/user/change-password')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({ senhaAntiga: 'teste123', senhaNova: '123teste' })
                .expect(404, done)
        })

        test('Mudança de senha com conta inválida', done => {
            request(app).post('/user/change-password')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({ senhaAntiga: 'teste123', senhaNova: '123teste' })
                .expect(400, done)
        })

        test('Mudança de senha com senha atual inválida', done => {
            request(app).post('/cadastro')
                .send({
                    nome: 'Teste',
                    usuario: 'teste',
                    email: 'teste@teste.com',
                    cel: '11111111111',
                    senha: 'teste123'
                })
                .end((err, res) => {
                    request(app).post('/user/change-password')
                        .set('Cookie', res.headers['set-cookie'][0])
                        .send({ senhaAntiga: 'senhaerrada', senhaNova: '123teste' })
                        .expect(401, done)
                })
        })
    })
})
describe('Testes de campeonato', () => {
    var cookieAdmin
    var cookie

    beforeAll(done => {
        request(app).post('/cadastro')
            .send({
                nome: 'Teste',
                usuario: 'testeAdmin',
                email: 'testeAdmin@teste.com',
                cel: '2222222222',
                senha: 'teste123'
            })
            .expect(200)
            .end((err, res) => {
                cookieAdmin = res.headers['set-cookie'][0]
                User.findById(cookieAdmin.split('=')[1].split(';')[0]).then(data => {
                    data.admin = true
                    User.replaceOne({ _id: cookieAdmin.split('=')[1].split(';')[0] }, data).then()
                    request(app).post('/cadastro')
                        .send({
                            nome: 'Teste',
                            usuario: 'teste',
                            email: 'teste@teste.com',
                            cel: '3333333333',
                            senha: 'teste123'
                        })
                        .expect(200)
                        .end((error, response) => {
                            cookie = response.headers['set-cookie'][0]
                            done()
                        })
                })
            })
    })

    describe('Teste de criação de campeonato', () => {
        beforeEach(async () => {
            await Camp.deleteMany({});
        });

        test('Cadastro de campeonato válido', done => {
            request(app).post('/create-camp')
                .send({ campType: 'fortnite' })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    Camp.findById(res.body.id).then(data => {
                        expect(data).toEqual(expect.objectContaining({ campType: 'fortnite' }))
                    })
                    done()
                })
        })

        test('Cadastro de campeonato com conta inexistente', done => {
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .expect(404, done)
        })

        test('Cadastro de campeonato com conta inválida', done => {
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .expect(401, done)
        })

        test('Cadastro de campeonato com conta sem admin', done => {
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookie)
                .expect(401, done)
        })
    })

    describe('Teste de inscrição', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite", maxPlayers: 1 })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    done()
                })
        })

        test('Inscrição válida', done => {
            request(app).post('/inscrever')
                .set('Cookie', cookie)
                .send({ campID: campID })
                .expect(200)
                .end(() => {
                    var find = false
                    Camp.findById(campID).then(data => {
                        data.listaPlayers.forEach(value => {
                            if (value.id == cookie.split('=')[1].split(';')[0]) find = true
                        });
                    })
                    expect(find).toBeFalsy()
                    done()
                })
        })

        test('Inscrição com campeonato inválido/inexistente', done => {
            request(app).post('/inscrever')
                .set('Cookie', cookie)
                .send({ campID: '5f5aef7a3324844f72c287c1' })
                .expect(400, done)
        })

        test('Inscrição com usuário inexistente', done => {
            request(app).post('/inscrever')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(404, done)
        })

        test('Inscrição com usuário inválido', done => {
            request(app).post('/inscrever')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(400, done)
        })

        test('Inscrições fechadas', (done) => {
            request(app).post('/create-camp')
                .send({ campType: "fortnite", inscricoesOn: false })
                .set('Cookie', cookie)
                .expect(201)
                .end((err, res) => {
                    request(app).post('/inscrever')
                        .set('Cookie', cookie)
                        .send({ campID: res.body.id })
                        .expect(200)
                        .end((err, res) => {
                            expect(res.body.sucess).toBeFalsy()
                            done()
                        })
                })

        })

        test('Inscrição repetida', done => {
            request(app).post('/inscrever')
                .set('Cookie', cookie)
                .send({ campID: campID })
                .expect(200)
                .end((err, res) => {
                    expect(res.body.sucess).toBeTruthy()
                    request(app).post('/inscrever')
                        .set('Cookie', cookie)
                        .send({ campID: campID })
                        .expect(409)
                        .end((err, res) => {
                            expect(res.body.sucess).toBeFalsy()
                            done()
                        })
                })
        })
    })

    describe('Testes de mudança de status', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    request(app).post('/inscrever')
                        .set('Cookie', cookie)
                        .send({ campID: campID })
                        .expect(200, done)
                })
        })

        test('Mudança de status válida', async done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: campID })
                .expect(200)
                .end(() => {
                    Camp.findById(campID).then(data => {
                        var find = false
                        data.listaPlayers.forEach(value => {
                            if (value.id == cookie.split('=')[1].split(';')[0]) {
                                find = true
                                expect(value.status).toBeTruthy()
                            }
                        });
                        expect(find).toBeTruthy()
                        done()
                    })
                })
        })

        test('Mudança de status com usuário inexistente', done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: '5f5c20bc8e53ea218fa8a5c2', campID: campID })
                .expect(404, done)
        })

        test('Mudança de status com usuário inválido', done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: 'sessionidinvalido', campID: campID })
                .expect(400, done)
        })

        test('Mudança de status com campeonato inexistente', done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: '5f5aef7a3324844f72c287c0' })
                .expect(404, done)
        })

        test('Mudança de status com campeonato inválido', done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: 'campidinvalido' })
                .expect(400, done)
        })

        test('Mudança de status com usuário sem admin', done => {
            request(app).put('/change-status')
                .set('Cookie', cookie)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: campID })
                .expect(401, done)
        })

        test('Mudança de status com usuário não inscrito', done => {
            request(app).put('/change-status')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookieAdmin.split('=')[1].split(';')[0], campID: campID })
                .expect(404, done)
        })
    })

    describe('Testes de deletar usuário do campeonato', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    request(app).post('/inscrever')
                        .set('Cookie', cookie)
                        .send({ campID: campID })
                        .expect(200, done)
                })
        })

        test('Deletar usuário válido', async done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: campID })
                .expect(200)
                .end(() => {
                    Camp.findById(campID).then(data => {
                        var find = false
                        data.listaPlayers.forEach(value => {
                            if (value.id == cookie.split('=')[1].split(';')[0]) {
                                find = true
                            }
                        });
                        expect(find).toBeFalsy()
                        done()
                    })
                })
        })

        test('Deletar com usuário inexistente', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: '5f5c20bc8e53ea218fa8a5c2', campID: campID })
                .expect(404, done)
        })

        test('Deletar com usuário inválido', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: 'sessionidinvalido', campID: campID })
                .expect(400, done)
        })

        test('Deletar usuário com campeonato inexistente', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: '5f5aef7a3324844f72c287c0' })
                .expect(404, done)
        })

        test('Deletar usuário com campeonato inválido', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: 'campidinvalido' })
                .expect(400, done)
        })

        test('Deletar com usuário sem admin', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookie)
                .send({ userID: cookie.split('=')[1].split(';')[0], campID: campID })
                .expect(401, done)
        })

        test('Deletar usuário não inscrito', done => {
            request(app).delete('/delete-user')
                .set('Cookie', cookieAdmin)
                .send({ userID: cookieAdmin.split('=')[1].split(';')[0], campID: campID })
                .expect(404, done)
        })
    })

    describe('Teste de deletar campeonato', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    done()
                })
        })

        test('Deletar campeonato válido', done => {
            request(app).delete('/delete-camp')
                .set('Cookie', cookieAdmin)
                .send({ campID: campID })
                .expect(200, done)
        })

        test('Deletar campeonato com usuário sem admin', done => {
            request(app).delete('/delete-camp')
                .set('Cookie', cookie)
                .send({ campID: campID })
                .expect(401, done)
        })

        test('Deletar campeonato com usuário inexistente', done => {
            request(app).delete('/delete-camp')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(404, done)
        })

        test('Deletar campeonato com usuário inválido', done => {
            request(app).delete('/delete-camp')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(400, done)
        })
    })

    describe('Testes de edição de campeonato', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    done()
                })
        })

        test('Edição de campeonato válida', done => {
            request(app).put('/edit-camp')
                .set('Cookie', cookieAdmin)
                .send({
                    campID: campID,
                    nome: 'Teste',
                    data: '01/01/1970',
                    hora: '13:00',
                    maxPlayers: '10',
                    limiteDataInscricoes: '01/01/1970',
                    inscricoesOn: false,
                    premiacao: '100.00',
                    inscricao: '15.00',
                    campType: 'rocketleague'
                })
                .expect(201)
                .end(() => {
                    Camp.findById(campID).then(data => {
                        expect(data).toEqual(expect.objectContaining({
                            nome: 'Teste',
                            data: '01/01/1970',
                            hora: '13:00',
                            maxPlayers: 10,
                            limiteDataInscricoes: '01/01/1970',
                            inscricoesOn: false,
                            premiacao: 100,
                            inscricao: 15,
                            campType: 'rocketleague'
                        }))
                        done()
                    })
                })
        })

        test('Edição de campeonato com campeonato inválido/inexistente', done => {
            request(app).put('/edit-camp')
                .set('Cookie', cookieAdmin)
                .send({
                    campID: 'campidinvalido',
                    nome: 'Teste',
                    data: '01/01/1970',
                    hora: '13:00',
                    maxPlayers: '10',
                    limiteDataInscricoes: '01/01/1970',
                    inscricoesOn: false,
                    premiacao: '100.00',
                    inscricao: '15.00',
                    campType: 'rocketleague'
                })
                .expect(400, done)
        })

        test('Edição de campeonato com usuário sem admin', done => {
            request(app).put('/edit-camp')
                .set('Cookie', cookie)
                .send({
                    campID: campID,
                    nome: 'Teste',
                    data: '01/01/1970',
                    hora: '13:00',
                    maxPlayers: '10',
                    limiteDataInscricoes: '01/01/1970',
                    inscricoesOn: false,
                    premiacao: '100.00',
                    inscricao: '15.00',
                    campType: 'rocketleague'
                })
                .expect(401, done)
        })

        test('Edição de campeonato com usuário inexistente', done => {
            request(app).put('/edit-camp')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({
                    campID: campID,
                    nome: 'Teste',
                    data: '01/01/1970',
                    hora: '13:00',
                    maxPlayers: '10',
                    limiteDataInscricoes: '01/01/1970',
                    inscricoesOn: false,
                    premiacao: '100.00',
                    inscricao: '15.00',
                    campType: 'rocketleague'
                })
                .expect(404, done)
        })

        test('Edição de campeonato com usuário inválido', done => {
            request(app).put('/edit-camp')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({
                    campID: campID,
                    nome: 'Teste',
                    data: '01/01/1970',
                    hora: '13:00',
                    maxPlayers: '10',
                    limiteDataInscricoes: '01/01/1970',
                    inscricoesOn: false,
                    premiacao: '100.00',
                    inscricao: '15.00',
                    campType: 'rocketleague'
                })
                .expect(400, done)
        })
    })

    describe('Testes de informações de todos os campeonato', () => {
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end(() => {
                    request(app).post('/create-camp')
                        .send({ campType: "rocketleague" })
                        .set('Cookie', cookieAdmin)
                        .expect(201, done)
                })
        })

        test('Todos os campeonatos', done => {
            request(app).get('/camps')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            campType: 'fortnite'
                        }),
                        expect.objectContaining({
                            campType: 'rocketleague'
                        })
                    ]))
                    done()
                })
        })

        test('Campeonato com tag expecífica', done => {
            request(app).get('/camps?tag=fortnite')
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(expect.arrayContaining([
                        expect.objectContaining({
                            campType: 'fortnite'
                        })
                    ]))
                    done()
                })
        })
    })

    describe('Testes de todas as informações dos campeonatos', () => {
        var campID
        beforeEach(async done => {
            await Camp.deleteMany({})
            request(app).post('/create-camp')
                .send({ campType: "fortnite" })
                .set('Cookie', cookieAdmin)
                .expect(201)
                .end((err, res) => {
                    campID = res.body.id
                    done()
                })
        })

        test('Busca válida', done => {
            request(app).post('/camp-admin')
                .set('Cookie', cookieAdmin)
                .send({ campID: campID })
                .expect(200)
                .end((err, res) => {
                    expect(res.body).toEqual(expect.objectContaining({ campType: 'fortnite' }))
                    done()
                })
        })

        test('Busca campeonatos com ID inválido/inexistente', done => {
            request(app).post('/camp-admin')
                .set('Cookie', cookieAdmin)
                .send({ campID: 'campidinvalido' })
                .expect(400, done)
        })

        test('Busca campeonatos com usuário sem admin', done => {
            request(app).post('/camp-admin')
                .set('Cookie', cookie)
                .send({ campID: campID })
                .expect(401, done)
        })

        test('Busca campeonatos com usuário inexistente', done => {
            request(app).post('/camp-admin')
                .set('Cookie', 'sessionID=5f5c20bc8e53ea218fa8a5c2;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(404, done)
        })

        test('Busca campeonato com usuário inválido', done => {
            request(app).post('/camp-admin')
                .set('Cookie', 'sessionID=sessionidinvalido;path=/; HttpOnly; SameSite=None; Secure')
                .send({ campID: campID })
                .expect(400, done)
        })
    })
})