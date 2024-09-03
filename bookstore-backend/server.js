const http = require("http");
// uvozi modul http koji omogucava kreiranje http servera i obradu http zahteva i odgovora

const app = require("./app");

const port = process.env.PORT || 3000;
// port na kojem ce server slusati
// prvo pokusava iz okoline varijable, ako to nije postavljeno onda 3000

const server = http.createServer(app);
// stvara http server
// prima fju koja se izvrsava svaki put kad se dobije zahtev

server.listen(port);
// pokrece server, osluskuje port i izvrsava sve sto se prosledi u createServer
