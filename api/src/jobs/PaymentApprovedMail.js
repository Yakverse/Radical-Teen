import Mail from '../lib/Mail';

export default {
  key: 'PaymentApprovedMail',
  options: {},
  async handle({ data }) {
    await Mail.sendEmail({
      Source: "RadicalTeen <no-reply@radicalteen.com.br>",
      Destination: {
          ToAddresses: [data.email]
      },
      Message: {
          Subject: {
              Data: "Seu Pagamento foi Aprovado!",
              Charset: 'UTF-8'
          },
          Body: {
              Html: {
                Data: `<div class="emailContent" style="padding: 5%; text-align: center;color: black;">
                            <img class="logoRadical" src="https://radicalteen.com.br/img/rtpreto.png" height="100vh">
                            <h1 class="emailTitle" style="font-size: 24px; margin-bottom: 1em;">Pagamento Aprovado</h1>
                            <p class="emailText" style="font-size: 16px; margin-bottom: 1.5em;">Seu pagamento para o campeonato de ${data.gameName} foi aprovado!</p>
                        </div>`
              },
              Text: {
                  Data: `Seu pagamento para o campeonato de ${data.gameName} foi aprovado!`,
                  Charset: 'UTF-8'
              }
          }
      },
      ReplyToAddresses: ['rodrigohsouza26@gmail.com']
  }).promise()
  },
};