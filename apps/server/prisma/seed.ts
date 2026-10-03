import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const assets = [
    { ticker: 'AAPL', name: 'Apple', price: 228, kind: 'stock', quantity: 0 },
    { ticker: 'MSFT', name: 'Microsoft', price: 430, kind: 'stock', quantity: 0 },
    { ticker: 'BTC', name: 'Bitcoin', price: 62000, kind: 'crypto', quantity: 0 },
    { ticker: 'ETH', name: 'Ethereum', price: 2400, kind: 'crypto', quantity: 0 },
  ];

  for (const asset of assets) {
    await prisma.asset.upsert({
      where: { ticker: asset.ticker },
      update: asset,
      create: asset,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
