// /lib/updateOrderStatusJob.ts

import cron from 'node-cron';
import { prisma } from '@/services/prisma.service';

export function startUpdateTransactionOrderStatusJob() {
  cron.schedule('* * * * *', async () => {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    const orders = await prisma.transactions.findMany({
      where: {
        orderStatus:  'PENDING_PROOF',
        createdAt: {
           lt: oneHourAgo,
        },
      },
    });

    for (const order of orders) {
      await prisma.transactions.update({
        where: { id: order.id },
        data: { orderStatus: 'FAILED_PAYMENT', failedPaymentDate: new Date()},
      });
    }
  });
}