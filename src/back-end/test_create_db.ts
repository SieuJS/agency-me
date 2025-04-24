import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Tạo một bản ghi trong bảng Quan
  const newQuan = await prisma.quan.create({
    data: {
      quan_id: 'quan1',
      ten_quan: 'Quận 1',
      thanh_pho: 'Hồ Chí Minh',
      gioi_han_so_daily: 50,
    },
  });
  console.log('Quan created:', newQuan);

  // Lấy tất cả bản ghi từ bảng Quan
  const allQuans = await prisma.quan.findMany();
  console.log('All Quans:', allQuans);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });