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
    this.app.use(cookieparser());
    // this.app.use(passport.initialize());
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
    require('./services/auth/googleStrategy')
    require('./services/auth/localStrategy')
    require('./services/auth/jwtStrategy')
    this.app.use(passport.initialize());

    this.app.get('/', requireJwtAuth, (req: Request, res: Response) => {
      res.send(`Hello, Purwadhika Student !`);
    });

    this.app.use('/auth', googleAuthRouter)
    this.app.use('/auth', localAuthRouter)

  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`  ➜  [API] Local:   http://localhost:${PORT}/`);
    });
  }
}
