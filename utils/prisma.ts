import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
  setTimeout(() => { require('./redis/init'); }, 0);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    setTimeout(() => { require('./redis/init'); }, 0);
  }
  prisma = global.prisma as PrismaClient;
}

export default prisma;

declare global {
    var prisma: PrismaClient;
}
