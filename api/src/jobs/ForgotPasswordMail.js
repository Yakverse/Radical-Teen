import Mail from '../lib/Mail';

export default {
  key: 'ForgotPasswordMail',
  options: {},
  async handle({ data }) {
    await Mail.sendEmail({
      Source: "RadicalTeen <no-reply@radicalteen.com.br>",
      Destination: {
          ToAddresses: [data.email]
      },
      Message: {
          Subject: {
              Data: "Redefinição de Senha",
              Charset: 'UTF-8'
          },
          Body: {
              Html: {
                Data: `<div class="emailContent" style="padding: 5%; text-align: center;color: black;">
                            <img class="logoRadical" src="https://radicalteen.com.br/img/rtpreto.png" height="100vh">
                            <h1 class="emailTitle" style="font-size: 24px; margin-bottom: 1em;">Resetar Senha</h1>
                            <p class="emailText" style="font-size: 16px; margin-bottom: 1.5em;">Você solicitou uma alteração de senha.
                                <br> Acesse radicalteen.com.br/forgot-password/${data.randomString} para alterá-la</p>
                        </div>`
              },
              Text: {
                  Data: `Acesse estelink: radicalteen.com.br/forgot-password/${data.randomString}`,
                  Charset: 'UTF-8'
              }
          }
      },
      ReplyToAddresses: ['rodrigohsouza26@gmail.com']
  }).promise()
  },
};