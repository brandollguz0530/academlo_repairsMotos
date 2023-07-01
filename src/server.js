require('dotenv').config();
const app = require('./app');
const { db } = require('./database/config');

db.authenticate()
  .then(() => console.log('Autenticado correctamente'))
  .catch((err) => console.log(err));

db.sync()
  .then(() => console.log('Base de datos correcta 🙃'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 9100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}! 🎉 `);
});
