const onvif = require('node-onvif');
const keypress = require('keypress');
const dotenv = require('dotenv');

dotenv.config();

const { CAMERA_IP, CAMERA_USER, CAMERA_PASS } = process.env;

(async () => {
  try {
    console.log('conectando...');

    const device = new onvif.OnvifDevice({
      xaddr: `http://${CAMERA_IP}:5000/onvif/device_service`,
      user: CAMERA_USER,
      pass: CAMERA_PASS,
    });
    console.log('conectado!');
    console.log('inicializando...');
    await device.init();
    console.log('inicializado!');

    const streamURL = device.getUdpStreamUrl();
    console.log('streamURL', streamURL);

    keypress(process.stdin);
    process.stdin.on('keypress', (_ch, key) => {
      let keyName = "";
      if (key?.shift) keyName += "shift+";
      if (key?.ctrl) keyName += "ctrl+";
      if (key?.meta) keyName += "meta+";
      keyName += key?.name || '';

      switch (keyName) {
        case 'ctrl+c':
          console.log("Tchau!");
          process.stdin.pause();
          process.exit(0);
        case 'up':
          console.log('movendo para cima');
          device.ptzMove({ speed: { y: 1 } })
          break;
        case 'down':
          console.log('movendo para baixo');
          device.ptzMove({ speed: { y: -1 } })
          break;
        case 'left':
          console.log('movendo para esquerda');
          device.ptzMove({ speed: { x: -1 } })
          break;
        case 'right':
          console.log('movendo para direita');
          device.ptzMove({ speed: { x: 1 } })
          break;
      }
    });
    process.stdin.setRawMode(true);
    process.stdin.resume();
    console.log('aguardando comandos!');

  } catch (error) {
    console.error('error', error);
  }
})();