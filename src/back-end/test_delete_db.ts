import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Xóa bản ghi với quan_id = 'quan1'
    const deletedQuan = await prisma.quan.delete({
    where: {
      quan_id: 'quan1',
    },
    });
    console.log('Deleted Quan:', deletedQuan);

    // // Xóa tất cả các Quận ở thành phố "Hồ Chí Minh"
    // const deleteResult = await prisma.quan.deleteMany({
    // where: {
    //   thanh_pho: 'Hồ Chí Minh',
    // },
    // });
    // console.log('Deleted Quans:', deleteResult.count);

    // // Xóa tất cả các khóa ngoại hoặc quan hệ với bảng cần xóa
    // await prisma.daiLy.deleteMany({
    //     where: {
    //       quan_id: 'quan1',
    //     },
    //   });

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