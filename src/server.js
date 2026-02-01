import app from './app.js';
import 'dotenv/config';
import './database/migrations/index.js'
app.listen(3001, () => console.log('application is running at port 3001'));
