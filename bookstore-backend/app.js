const express = require('express');
const routesVersioning = require('express-routes-versioning')();

const app = express();

const morgan = require('morgan');
// sluzi za generisanje logova HTTP zahteva

const bodyParser = require('body-parser');
// uvozi body-parser modul koji je dizajniran za parsiranje tela HTTP zahteva, posebno korisno za post i put

const mongoose = require('mongoose');
// biblioteka za upravljanje MongoDB bazama podataka

const productRoutes = require('./api/routes/products');
const orderRouts = require('./api/routes/orders');
const authorRoutesV1 = require('./api/routes/v1/authors');
const authorRoutesV2 = require('./api/routes/v2/authors');
const userRoutes = require('./api/routes/user');
const { uploadController } = require('./api/controllers/uploads');
const uri =
  'mongodb+srv://milan:milan@starter.sh0sk.mongodb.net/jelena?retryWrites=true&w=majority&appName=Starter';
mongoose.connect(
  // uspostavlja se veza sa bazom
  // prvo prima URI koji sadrzi korisnicko ime i lozinku
  uri,
  {
    // useMongoClient: true,
  }
  // objekat sa uputstvima za postavku baze
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
// postavlja dev format, koji sadrzi metodu http zahteva, putanju, statusni kod i vreme odziva
// i to se ispisuje u terminalu kad god se posalje neki zahtev
app.use(bodyParser.urlencoded({ extended: false }));
// postavlja middleware za parsiranje URL kodiranih tela, govori da koristi Node.js ugradjenu biblioteku za querystring
app.use(bodyParser.json());
// postavlja middleware za parsiranje JSON tela u express aplikaciji, parsira telo zahteva kao json objekat sto omogucuje aplikaciji pristup podacima poslatim u json formatu

//CORS regulise pristup resursima na serverima iz razlicitih izvora
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // server dobija zahteve sa bilo kog izvora
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  // definise koja dodatna zaglavlja su dopustena u zahtevu
  if (req.method === 'OPTIONS') {
    // metoda options se koristi kao provera pre stvarnog zahteva kako bi se utvrdilo koje metode i resursi su dostupni sa odredjenog domena
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({}); // prazan odgovor sa statusom 200, signalizira klijentu da je server spreman da prihvati zahteve i koje metode su dopustene
  }
  next();
});

app.use(
  '/uploads',
  express.static('/Users/subot/Downloads/BookStoreBack/uploads')
);
app.use('/products', productRoutes);
app.use('/orders', orderRouts);
app.use('/user', userRoutes);
app.use('/author', authorRoutesV1);
app.post('/uploads', uploadController);

// obrada gresaka
app.use((req, res, next) => {
  const error = new Error('Not found'); // stvara se greska sa porukom
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
