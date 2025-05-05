// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//     // 1. Seed Loại nhân viên
//     await prisma.loaiNhanVien.createMany({
//         data: [
//             { loai_nhan_vien_id: 'admin', ten_loai: 'Admin' , 'mo_ta': 'Quản lý hệ thống' },
//             { loai_nhan_vien_id: 'staff', ten_loai: 'Staff' , 'mo_ta': 'Nhân viên' },
//         ],
//         skipDuplicates: true,
//     });

//     // 2. Seed Nhân viên
//     await prisma.nhanVien.createMany({
//         data: [
//             {
//                 nhan_vien_id: 'nv001',
//                 ten: 'Nguyễn Hùng Phát',
//                 dien_thoai: '0000000001',
//                 email: 'hungphat@gmail.com',
//                 loai_nhan_vien_id: 'admin', // đã có loại admin
//                 dia_chi: '123 ABC',
//                 mat_khau: '123',
//                 ngay_them: new Date(),
//             },
//             {
//                 nhan_vien_id: 'nv002',
//                 ten: 'Lê Minh Hùng',
//                 dien_thoai: '0000000002',
//                 email: 'minhhung@gmail.com',
//                 loai_nhan_vien_id: 'staff',
//                 dia_chi: '456 DEF',
//                 mat_khau: '123',
//                 ngay_them: new Date(),
//             },
//             {
//                 nhan_vien_id: 'nv003',
//                 ten: 'Lê Quốc Hưng',
//                 dien_thoai: '0000000003',
//                 email: 'quochung@gmail.com',
//                 loai_nhan_vien_id: 'staff',
//                 dia_chi: '789 GHI',
//                 mat_khau: '123',
//                 ngay_them: new Date(),
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // 3. Seed Quận
//     await prisma.quan.createMany({
//         data: [
//             { quan_id: '01', ten_quan: 'Quận 1', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
//             { quan_id: '02', ten_quan: 'Quận 2', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
//             { quan_id: '03', ten_quan: 'Quận 3', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
//             { quan_id: '04', ten_quan: 'Quận 4', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
//             { quan_id: '05', ten_quan: 'Quận 5', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
//             { quan_id: 'dongda', ten_quan: 'Quận Đống Đa', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
//             { quan_id: 'hoankiem', ten_quan: 'Quận Hoàn Kiếm', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
//             { quan_id: 'badinh', ten_quan: 'Quận Ba Đình', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
//             { quan_id: 'caugiay', ten_quan: 'Quận Cầu Giấy', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
//             { quan_id: 'longbien', ten_quan: 'Quận Long Biên', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
//             { quan_id: 'hongbang', ten_quan: 'Quận Hồng Bàng', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
//             { quan_id: 'ngoquyen', ten_quan: 'Quận Ngô Quyền', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
//             { quan_id: 'lechan', ten_quan: 'Quận Lê Chân', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
//         ],
//         skipDuplicates: true,
//     });

//     // 4. Seed Loại đại lý (BẮT BUỘC TRƯỚC khi seed Đại lý)
//     await prisma.loaiDaiLy.createMany({
//         data: [
//             { loai_daily_id: 'loai001', ten_loai: 'Loại 1' , 'tien_no_toi_da': 20000},
//             { loai_daily_id: 'loai002', ten_loai: 'Loại 2' , 'tien_no_toi_da': 50000},
//         ],
//         skipDuplicates: true,
//     });

//     // 5. Seed Đại lý
//     await prisma.daiLy.createMany({
//         data: [
//             {
//                 daily_id: 'daily001',
//                 ten: 'Đại Lý Alpha',
//                 dien_thoai: '0981111111',
//                 dia_chi: '789 XYZ',
//                 email: 'daily1@gmail.com',
//                 quan_id: '01',
//                 loai_daily_id: 'loai001', 
//                 tien_no: 0,
//                 ngay_tiep_nhan: new Date(),
//                 nhan_vien_tiep_nhan: 'nv003',
//             },
//             {
//                 daily_id: 'daily002',
//                 ten: 'Đại Lý Beta',
//                 dien_thoai: '0982222222',
//                 dia_chi: '101 ABC',
//                 email: 'daily2@gmail.com',
//                 quan_id: 'hoankiem', 
//                 loai_daily_id: 'loai002',
//                 tien_no: 0,
//                 ngay_tiep_nhan: new Date(),
//                 nhan_vien_tiep_nhan: 'nv002',
//             },
//         ],
//         skipDuplicates: true,
//     });

//     // 6. Seed Quy định
//     await prisma.quy_Dinh_1.upsert({
//         where: { id: 1 },
//         update: {},
//         create: {
//             id: 1,
//             so_luong_cac_loai_daily: 2,
//             so_dai_ly_toi_da_trong_quan: 4,
//             so_luong_mat_hang_toi_da: 5,
//             so_luong_don_vi_tinh: 3,
//             loai_daily_id: 'loai001', 
//             tien_no_toi_da: 5000000,
//         },
//     });

//     console.log('Successfully');
// }

// main()
//     .catch((e) => {
//         console.error(e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });

// --------

import { PrismaClient } from '@prisma/client';
import { generateRandomNhanVien, generateRandomDaiLy } from './seedFactory';

const prisma = new PrismaClient();

async function main() {
    //  Seed Loại nhân viên
    await prisma.loaiNhanVien.createMany({
        data: [
            { loai_nhan_vien_id: 'admin', ten_loai: 'Admin' , 'mo_ta': 'Quản lý hệ thống' },
            { loai_nhan_vien_id: 'staff', ten_loai: 'Staff' , 'mo_ta': 'Nhân viên' },
        ],
        skipDuplicates: true,
    });

    // 4. Seed Loại đại lý (BẮT BUỘC TRƯỚC khi seed Đại lý)
    await prisma.loaiDaiLy.createMany({
        data: [
            { loai_daily_id: 'loai001', ten_loai: 'Loại 1' , 'tien_no_toi_da': 20000},
            { loai_daily_id: 'loai002', ten_loai: 'Loại 2' , 'tien_no_toi_da': 50000},
        ],
        skipDuplicates: true,
    });

    // Seed nhân viên cố định
    await prisma.nhanVien.createMany({
        data: [
            {
                nhan_vien_id: 'nv001',
                ten: 'Nguyễn Hùng Phát',
                dien_thoai: '0000000001',
                email: 'hungphat@gmail.com',
                loai_nhan_vien_id: 'admin',
                dia_chi: '123 ABC',
                mat_khau: '123',
                ngay_them: new Date(),
            },
            {
                nhan_vien_id: 'nv002',
                ten: 'Lê Minh Hùng',
                dien_thoai: '0000000002',
                email: 'minhhung@gmail.com',
                loai_nhan_vien_id: 'staff',
                dia_chi: '456 DEF',
                mat_khau: '123',
                ngay_them: new Date(),
            },
            {
                nhan_vien_id: 'nv003',
                ten: 'Lê Quốc Hưng',
                dien_thoai: '0000000003',
                email: 'quochung@gmail.com',
                loai_nhan_vien_id: 'staff',
                dia_chi: '789 GHI',
                mat_khau: '123',
                ngay_them: new Date(),
            },
        ],
        skipDuplicates: true,
    });

    // Seed Quận
    await prisma.quan.createMany({
        data: [
            { quan_id: '01', ten_quan: 'Quận 1', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
            { quan_id: '02', ten_quan: 'Quận 2', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
            { quan_id: '03', ten_quan: 'Quận 3', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
            { quan_id: '04', ten_quan: 'Quận 4', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
            { quan_id: '05', ten_quan: 'Quận 5', thanh_pho: 'TP.HCM', gioi_han_so_daily: 4 },
            { quan_id: 'dongda', ten_quan: 'Quận Đống Đa', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
            { quan_id: 'hoaniem', ten_quan: 'Quận Hoàn Kiếm', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
            { quan_id: 'badinh', ten_quan: 'Quận Ba Đình', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
            { quan_id: 'caugiay', ten_quan: 'Quận Cầu Giấy', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
            { quan_id: 'longbien', ten_quan: 'Quận Long Biên', thanh_pho: 'Hà Nội', gioi_han_so_daily: 4 },
            { quan_id: 'hongbang', ten_quan: 'Quận Hồng Bàng', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
            { quan_id: 'ngoquyen', ten_quan: 'Quận Ngô Quyền', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
            { quan_id: 'lechan', ten_quan: 'Quận Lê Chân', thanh_pho: 'Hải Phòng', gioi_han_so_daily: 4 },
        ],
        skipDuplicates: true,
    });

    // Seed Đại lý cố định
    await prisma.daiLy.createMany({
        data: [
            {
                daily_id: 'daily001',
                ten: 'Đại Lý Alpha',
                dien_thoai: '0981111111',
                dia_chi: '789 XYZ',
                email: 'daily1@gmail.com',
                quan_id: '01',
                loai_daily_id: 'loai001',
                tien_no: 0,
                ngay_tiep_nhan: new Date(),
                nhan_vien_tiep_nhan: 'nv003',
            },
            {
                daily_id: 'daily002',
                ten: 'Đại Lý Beta',
                dien_thoai: '0982222222',
                dia_chi: '101 ABC',
                email: 'daily2@gmail.com',
                quan_id: 'hoaniem',
                loai_daily_id: 'loai002',
                tien_no: 0,
                ngay_tiep_nhan: new Date(),
                nhan_vien_tiep_nhan: 'nv002',
            },
        ],
        skipDuplicates: true,
    });

    // Seed Quy định
    await prisma.quy_Dinh_1.upsert({
        where: { id: 1 },
        update: {},
        create: {
            id: 1,
            so_luong_cac_loai_daily: 2,
            so_dai_ly_toi_da_trong_quan: 4,
            so_luong_mat_hang_toi_da: 5,
            so_luong_don_vi_tinh: 3,
            loai_daily_id: 'loai001',
            tien_no_toi_da: 5000000,
        },
    });

    // Seed 50 nhân viên random
    const randomNhanViens = generateRandomNhanVien(50);
    await prisma.nhanVien.createMany({
        data: randomNhanViens,
        skipDuplicates: true,
    });


    const randomDaiLys = generateRandomDaiLy(20);
    await prisma.daiLy.createMany({
        data: randomDaiLys,
        skipDuplicates: true,
    });

    console.log('Seed Successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
