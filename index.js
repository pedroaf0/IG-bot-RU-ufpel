
require('tools-for-instagram');
const {UltimateTextToImage, getCanvasImage} = require("ultimate-text-to-image");
const path = require('path');
const request = require('request');
const moment = require('moment');  
moment.locale('pt-br');   

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


(async () => {

    console.log("\n1 -- LOGIN --\n".bold.underline);
    let ig = await login();


    
   request('https://cobalto.ufpel.edu.br/dashboard/cardapios/cardapio/listaCardapios?null&cmbRestaurante=6&_search=false&nd=1664135529458&rows=-1&page=1&sidx=refeicao+asc%2C+id&sord=asc', async function (error, response, body) {
        body = JSON.parse(body);
        // console.log('body:', body.rows); // Print the HTML for the Google homepage.
        var text = `Almoço ${moment().format('L')}\n\n`;
        for (let index = 0; index < body.rows.length; index++) {
            const element = body.rows[index];
            if (body.rows[index].refeicao == 'ALMOÇO') {
                //console.log(body.rows[index].nome)
                text += capitalizeFirstLetter((body.rows[index].nome + '\n').toLowerCase());
            }
        }
        console.log(text);
        
        const url = 'https://i.imgur.com/cZeknUs.png'
        const canvasImage = await getCanvasImage({url});
    
          new UltimateTextToImage(text, {fontWeight: "bold", width: 1406,height:1406,fontSize:80, align: "center",
          valign: "middle", fontFamily: "Arial, Sans", images: [{canvasImage: canvasImage, layer: -1, repeat: "fit"}]})
        .render()
        .toFile(path.join(__dirname, '/image.jpg'));
        
        let picturePath = path.join(__dirname, '/image.jpg')
        let caption = text;
        let image = await uploadPicture(ig, caption, picturePath);
        console.log("\nProcess done!\n".green);

        // If ONLINE_MODE is enabled, this example will run until we send an exit signal
        process.exit();
    });
    


    
   
   
    
})();
