import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Cập nhật bản ghi với quan_id = 'quan1'
    const updatedQuan = await prisma.quan.update({
        where: {
        quan_id: 'quan1',
        },
        data: {
        gioi_han_so_daily: 4,
        },
    });
    console.log('Updated Quan:', updatedQuan);


    // Updat nhiều bản ghi: Cập nhật tất cả Quận ở thành phố "Hồ Chí Minh"
    // const updateResult = await prisma.quan.updateMany({
    //     where: {
    //     thanh_pho: 'Hồ Chí Minh',
    //     },
    //     data: {
    //     gioi_han_so_daily: 75,
    //     },
    // });
    // console.log('Updated Quans:', updateResult.count);

    // Kiểm tra lại danh sách Quan
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