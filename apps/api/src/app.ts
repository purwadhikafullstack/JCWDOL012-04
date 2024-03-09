import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import cartRouter from './routers/cart.router';
import {prisma} from './services/prisma.service';
import { join } from 'path';
import { ProductRouter } from './routers/product.router';
import passport from 'passport';
import cookieparser from 'cookie-parser';
import { googleAuthRouter } from './routers/authGoogle.router';
import { localAuthRouter } from './routers/localAuth.router';
import { requireJwtAuth } from './middlewares/requireJwtAuth';
import transactionRouter from './routers/transaction.router';

export default class App {
  private app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure(): void {
    this.app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
    this.app.use('/public', express.static(join(__dirname, './public')));
    this.app.use(cookieparser());
  }

  private handleError(): void {
    // not found
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.path.includes('/api/')) {
        res.status(404).send('Not found !');
      } else {
        next();
      }
    });

    // error
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        if (req.path.includes('/api/')) {
          console.error('Error : ', err.stack);
          res.status(500).send('Error !');
        } else {
          next();
        }
      },
    );
  }


  private routes(): void {
    const productRouter = new ProductRouter();
    // const sampleRouter = new SampleRouter();
    require('./services/googleStrategy');
    require('./services/localStrategy');
    require('./services/jwtStrategy');
    this.app.use(passport.initialize());

    this.app.get('/', requireJwtAuth, (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });
    this.app.use('/api/cart', cartRouter);
    this.app.use('/api/transaction', transactionRouter);


    this.app.use('/api', productRouter.getRouter());
    this.app.use('/auth', googleAuthRouter);
    this.app.use('/auth', localAuthRouter);
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }

  private setupSignalHandlers() {
    process.on('SIGINT', async () => {
      await prisma.$disconnect();
      console.log('Prisma client disconnected');
      process.exit();
    });
  }
}
