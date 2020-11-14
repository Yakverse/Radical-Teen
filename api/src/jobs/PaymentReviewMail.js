import Mail from '../lib/Mail';

export default {
  key: 'PaymentReviewMail',
  options: {},
  async handle({ data }) {
    await Mail.sendEmail({
      Source: "RadicalTeen <no-reply@radicalteen.com.br>",
      Destination: {
          ToAddresses: [data.email]
      },
      Message: {
          Subject: {
              Data: "Pagamento em análise",
              Charset: 'UTF-8'
          },
          Body: {
              Html: {
                Data: `<div class="emailContent" style="padding: 5%; text-align: center;color: black;">
                            <img class="logoRadical" src="https://radicalteen.com.br/img/rtpreto.png" height="100vh">
                            <h1 class="emailTitle" style="font-size: 24px; margin-bottom: 1em;">Pagamento em Análise</h1>
                            <p class="emailText" style="font-size: 16px; margin-bottom: 1.5em;">Você se inscreveu com sucesso no campeonato de ${data.gameName}. Seu pagamento agora está em análise.</p>
                        </div>`
              },
              Text: {
                  Data: `Você se inscreveu com sucesso no campeonato de ${data.gameName}. Seu pagamento agora está em análise.`,
                  Charset: 'UTF-8'
              }
          }
      },
      ReplyToAddresses: ['rodrigohsouza26@gmail.com']
  }).promise()
  },
};