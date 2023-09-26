const app = require('./app');
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 8080) : 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
})
