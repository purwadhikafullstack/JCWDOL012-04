import cron from 'node-cron';
import { prisma } from '@/services/prisma.service';

export function startUpdateOrderStatusJob() {
  cron.schedule('0 * * * *', async () => {
    const fortyEightHoursAgo = new Date();
    fortyEightHoursAgo.setHours(fortyEightHoursAgo.getHours() - 48);

    const orders = await prisma.transactions.findMany({
      where: {
        orderStatus: 'SHIPPING',
        createdAt: {
          lt: fortyEightHoursAgo,
        },
      },
    });

    for (const order of orders) {
      await prisma.transactions.update({
        where: { id: order.id },
        data: { orderStatus: 'CONFIRMED', confirmationDate: new Date()},
      });
    }
  });
}