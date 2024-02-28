import { Request, Response } from 'express';
import prisma from '@/prisma';

export class SampleController {
  async getSampleData(req: Request, res: Response) {

    return res.status(200).send("OK");
  }

  async getSampleDataById(req: Request, res: Response) {

    return res.status(200).send("OK");
  }

  async createSampleData(req: Request, res: Response) {

    return res.status(201).send("Created");
  }
}
