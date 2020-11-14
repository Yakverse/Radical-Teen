import Mail from '../lib/Mail';

export default {
  key: 'RegistrationMail',
  options: {},
  async handle({ data }) {
    await Mail.sendEmail({
      Source: "RadicalTeen <no-reply@radicalteen.com.br>",
      Destination: {
          ToAddresses: [data.email]
      },
      Message:{
        Subject: {
          Data: 'Confirmação de Email',
          Charset: "UTF-8"
        },
        Body: {
          Html: {
            Data: `<div class="emailContent" style="padding: 5%; text-align: center;color: black;">
                      <img class="logoRadical" src="https://radicalteen.com.br/img/rtpreto.png" height="100vh">
                      <h1 class="emailTitle" style="font-size: 24px; margin-bottom: 1em;">Bem-Vindo ao Radical Teen</h1>
                      <p class="emailText" style="font-size: 16px; margin-bottom: 1.5em;">Clique no botão abaixo para confirmar seu email. Ou acesse este link: <a href="radicalteen.com.br/verification/${data.randomString}" style="color: black; font-weight: bold;">radicalteen.com.br/verification/${data.randomString}</a></p>
                      <a href="radicalteen.com.br/verification/${data.randomString}">
                          <button class="emailButton" style="padding: 1vh; border: 0px; border-radius: 1vh; background: black; color: white; margin: 0; min-width: 30%; clip-path: polygon(8% 0,100% 0,93% 93%,0 100%); transition: all .3s ease-in-out; text-align: center;">
                              <span style="font-size: 3.5vh; line-height: 100%; padding-left: 3vh; padding-right: 3vh;">Confirmar Email</span>
                          </button>
                      </a>
                  </div>`
          },
          Text: {
            Data: `Acesse este link: radicalteen.com.br/verification/${data.randomString}`,
            Charset: 'UTF-8'
          }
        },
      }
  }).promise()
  },
};