const express = require('express');
const app = express();
const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');

app.use(express.json());
app.use('/health', healthRouter);
app.use('/users', usersRouter);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
