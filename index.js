import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal"
import * as router from "./router.js"

const client = new Client()

router.lunch()

client.on('qr', qrCode => {
  router.changeQr(qrCode)
  qrcode.generate(qrCode, { small: true })
})

client.on('message', msg => {
  try {
    if (msg.body.toLocaleLowerCase() == '!ping') {
      msg.reply('Pong')
    }
  } catch (err) {
    console.log('erreur \n\n', err)
  }
})

client.on('ready', function () {})

client.initialize()