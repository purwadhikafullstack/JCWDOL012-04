import App from './app';
import * as dotenv from 'dotenv';

dotenv.config();

const main = () => {
  // init db here

  const app = new App();
  app.start();
};

main();
