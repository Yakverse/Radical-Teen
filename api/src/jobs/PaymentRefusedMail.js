import Mail from '../lib/Mail';

export default {
  key: 'PaymentRefusedMail',
  options: {},
  async handle({ data }) {
    await Mail.sendEmail({
      Source: "RadicalTeen <no-reply@radicalteen.com.br>",
      Destination: {
          ToAddresses: [data.email]
      },
      Message: {
          Subject: {
              Data: "Pagamento Recusado",
              Charset: 'UTF-8'
          },
          Body: {
              Html: {
                Data: `<div class="emailContent" style="padding: 5%; text-align: center;color: black;">
                            <img class="logoRadical" src="https://radicalteen.com.br/img/rtpreto.png" height="100vh">
                            <h1 class="emailTitle" style="font-size: 24px; margin-bottom: 1em;">Pagamento Recusado</h1>
                            <p class="emailText" style="font-size: 16px; margin-bottom: 1.5em;">Seu pagamento para o campeonato de ${data.gameName} foi analisado e reprovado. Parece que houve algum erro. 
                                <br> Acesse ${data.campLink} para tentar novamente.</p>
                        </div>`
              },
              Text: {
                  Data: `Seu pagamento para o campeonato de ${data.gameName} foi analisado e reprovado. Parece que houve algum erro.\nAcesse ${data.campLink} para tentar novamente.`,
                  Charset: 'UTF-8'
              }
          }
      },
      ReplyToAddresses: ['rodrigohsouza26@gmail.com']
  }).promise()
  },
};