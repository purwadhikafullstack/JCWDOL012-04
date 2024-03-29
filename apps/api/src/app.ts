import express, {
  json,
  urlencoded,
  Express,
  Request,
  Response,
  NextFunction,
} from 'express';
import cors from 'cors';
import { PORT } from './config';
import passport from 'passport';
import cookieparser from 'cookie-parser';
import { googleAuthRouter } from './routers/auth/authGoogle.router';
import { localAuthRouter } from './routers/auth/localAuth.router';
import { requireJwtAuth } from './middlewares/auth/requireJwtAuth';
import cartRouter from './routers/cart.router';
import { prisma } from './services/prisma.service';
import { ProductRouter } from './routers/product.router';
import { profileRouter } from './routers/profile.router';
import { userRouter } from './routers/user.router';
import { dataRouter } from './routers/data.router';
import { shippingRouter } from './routers/shipping.router';
import warehouseRouter from './routers/warehouse.router';
import { ReportRouter } from './routers/report.router';

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
    this.app.use(express.static('public'));
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
    const reportRouter = new ReportRouter();
    // const sampleRouter = new SampleRouter();
    require('./services/auth/googleStrategy');
    require('./services/auth/localStrategy');
    require('./services/auth/jwtStrategy');
    this.app.use(passport.initialize());

    this.app.get('/', requireJwtAuth, (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });
    this.app.use('/api/cart', cartRouter);

    this.app.use('/api', productRouter.getRouter());
    this.app.use('/auth', googleAuthRouter);
    this.app.use('/auth', localAuthRouter);
    this.app.use('/profile', profileRouter);
    this.app.use('/user', userRouter);
    this.app.use('/data', dataRouter);
    this.app.use('/shipping', shippingRouter);
    this.app.use('/warehouses', warehouseRouter);
    this.app.use('/api/report', reportRouter.getRouter());
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
