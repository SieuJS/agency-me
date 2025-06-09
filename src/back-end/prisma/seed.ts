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
import * as bcrypt from 'bcrypt';

const prisma: PrismaClient = new PrismaClient();

async function main() {
  //  Seed Loại nhân viên
  await prisma.loaiNhanVien.createMany({
    data: [
      {
        loai_nhan_vien_id: 'admin',
        ten_loai: 'Admin',
        mo_ta: 'Quản lý hệ thống',
      },
      { loai_nhan_vien_id: 'staff', ten_loai: 'Staff', mo_ta: 'Nhân viên' },
    ],
    skipDuplicates: true,
  });

  // 4. Seed Loại đại lý (BẮT BUỘC TRƯỚC khi seed Đại lý)
  await prisma.loaiDaiLy.createMany({
    data: [
      { loai_daily_id: 'loai001', ten_loai: 'Loại 1', tien_no_toi_da: 20000 },
      { loai_daily_id: 'loai002', ten_loai: 'Loại 2', tien_no_toi_da: 50000 },
    ],
    skipDuplicates: true,
  });

  // Seed nhân viên cố định
  const hashedPassword = await bcrypt.hash('123456789', 10);
  await prisma.nhanVien.createMany({
    data: [
      {
        nhan_vien_id: 'nv001',
        ten: 'Nguyễn Hùng Phát',
        dien_thoai: '0000000001',
        email: '  ',
        loai_nhan_vien_id: 'admin',
        dia_chi: '123 ABC',
        mat_khau: hashedPassword,
        ngay_them: new Date(),
      },
      {
        nhan_vien_id: 'nv002',
        ten: 'Lê Minh Hùng',
        dien_thoai: '0000000002',
        email: 'minhhung@gmail.com',
        loai_nhan_vien_id: 'staff',
        dia_chi: '456 DEF',
        mat_khau: hashedPassword,
        ngay_them: new Date(),
      },
      {
        nhan_vien_id: 'nv003',
        ten: 'Lê Quốc Hưng',
        dien_thoai: '0000000003',
        email: 'quochung@gmail.com',
        loai_nhan_vien_id: 'staff',
        dia_chi: '789 GHI',
        mat_khau: hashedPassword,
        ngay_them: new Date(),
      },
    ],
    skipDuplicates: true,
  });

  // Seed Quận
  await prisma.quan.createMany({
    data: [
      {
        quan_id: '01',
        ten_quan: 'Quận 1',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '02',
        ten_quan: 'Quận 2',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '03',
        ten_quan: 'Quận 3',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '04',
        ten_quan: 'Quận 4',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '05',
        ten_quan: 'Quận 5',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'dongda',
        ten_quan: 'Quận Đống Đa',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'hoankiem',
        ten_quan: 'Quận Hoàn Kiếm',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'badinh',
        ten_quan: 'Quận Ba Đình',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'caugiay',
        ten_quan: 'Quận Cầu Giấy',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'longbien',
        ten_quan: 'Quận Long Biên',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'hongbang',
        ten_quan: 'Quận Hồng Bàng',
        thanh_pho: 'Hải Phòng',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'ngoquyen',
        ten_quan: 'Quận Ngô Quyền',
        thanh_pho: 'Hải Phòng',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'lechan',
        ten_quan: 'Quận Lê Chân',
        thanh_pho: 'Hải Phòng',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '06',
        ten_quan: 'Quận 6',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '07',
        ten_quan: 'Quận 7',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '08',
        ten_quan: 'Quận 8',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: '10',
        ten_quan: 'Quận 10',
        thanh_pho: 'TP.HCM',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'tayho',
        ten_quan: 'Quận Tây Hồ',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'haibatrung',
        ten_quan: 'Quận Hai Bà Trưng',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
      {
        quan_id: 'thanhxuan',
        ten_quan: 'Quận Thanh Xuân',
        thanh_pho: 'Hà Nội',
        gioi_han_so_daily: 4,
      },
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
  // 7. Seed DonViTinh
  await prisma.donViTinh.createMany({
    data: [
      {
        don_vi_tinh_id: 'donvi001',
        ky_hieu: 'kg',
        ten_don_vi: 'kilogram',
        loai_don_vi: 'Khối lượng',
      },
      {
        don_vi_tinh_id: 'donvi002',
        ky_hieu: 'g',
        ten_don_vi: 'gram',
        loai_don_vi: 'Khối lượng',
      },
      {
        don_vi_tinh_id: 'donvi003',
        ky_hieu: 'tạ',
        ten_don_vi: 'quintal',
        loai_don_vi: 'Khối lượng',
      },
      {
        don_vi_tinh_id: 'donvi004',
        ky_hieu: 'km',
        ten_don_vi: 'kilometer',
        loai_don_vi: 'Độ dài',
      },
      {
        don_vi_tinh_id: 'donvi005',
        ky_hieu: 'cm',
        ten_don_vi: 'centimeter',
        loai_don_vi: 'Độ dài',
      },
      {
        don_vi_tinh_id: 'donvi006',
        ky_hieu: 'mm',
        ten_don_vi: 'millimeter',
        loai_don_vi: 'Độ dài',
      },
      {
        don_vi_tinh_id: 'donvi007',
        ky_hieu: 'm',
        ten_don_vi: 'meter',
        loai_don_vi: 'Độ dài',
      },
      {
        don_vi_tinh_id: 'donvi008',
        ky_hieu: 'm3',
        ten_don_vi: 'cubic meter',
        loai_don_vi: 'Thể tích',
      },
      {
        don_vi_tinh_id: 'donvi009',
        ky_hieu: 'l',
        ten_don_vi: 'liter',
        loai_don_vi: 'Thể tích',
      },
      {
        don_vi_tinh_id: 'donvi010',
        ky_hieu: 'ml',
        ten_don_vi: 'milliliter',
        loai_don_vi: 'Thể tích',
      },
      {
        don_vi_tinh_id: 'donvi011',
        ky_hieu: 'lít',
        ten_don_vi: 'liter',
        loai_don_vi: 'Thể tích',
      },
      {
        don_vi_tinh_id: 'donvi012',
        ky_hieu: 'cái',
        ten_don_vi: 'item',
        loai_don_vi: 'Số lượng',
      },
      {
        don_vi_tinh_id: 'donvi013',
        ky_hieu: 'con',
        ten_don_vi: 'animal',
        loai_don_vi: 'Số lượng',
      },
      {
        don_vi_tinh_id: 'donvi014',
        ky_hieu: 'chiếc',
        ten_don_vi: 'piece',
        loai_don_vi: 'Số lượng',
      },
    ],
    skipDuplicates: true,
  });

  // 8. Seed MatHang
  await prisma.matHang.createMany({
    data: [
      {
        mathang_id: 'mh001',
        ten: 'Gạo',
        don_vi_tinh_id: 'donvi001',
        don_gia: 15.0,
      },
      {
        mathang_id: 'mh002',
        ten: 'Gà',
        don_vi_tinh_id: 'donvi013',
        don_gia: 120.0,
      },
      {
        mathang_id: 'mh003',
        ten: 'Vịt',
        don_vi_tinh_id: 'donvi013',
        don_gia: 130.0,
      },
      {
        mathang_id: 'mh004',
        ten: 'Thịt heo',
        don_vi_tinh_id: 'donvi001',
        don_gia: 180.0,
      },
      {
        mathang_id: 'mh005',
        ten: 'Thịt bò',
        don_vi_tinh_id: 'donvi001',
        don_gia: 350.0,
      },
      {
        mathang_id: 'mh006',
        ten: 'Trứng gà',
        don_vi_tinh_id: 'donvi012',
        don_gia: 3.0,
      },
      {
        mathang_id: 'mh007',
        ten: 'Sữa tươi',
        don_vi_tinh_id: 'donvi009',
        don_gia: 20.0,
      },
      {
        mathang_id: 'mh008',
        ten: 'Nước suối',
        don_vi_tinh_id: 'donvi010',
        don_gia: 5.0,
      },
      {
        mathang_id: 'mh009',
        ten: 'Xăng',
        don_vi_tinh_id: 'donvi009',
        don_gia: 25.0,
      },
      {
        mathang_id: 'mh010',
        ten: 'Dầu ăn',
        don_vi_tinh_id: 'donvi009',
        don_gia: 40.0,
      },
      {
        mathang_id: 'mh011',
        ten: 'Đường',
        don_vi_tinh_id: 'donvi001',
        don_gia: 20.0,
      },
      {
        mathang_id: 'mh012',
        ten: 'Muối',
        don_vi_tinh_id: 'donvi001',
        don_gia: 10.0,
      },
      {
        mathang_id: 'mh013',
        ten: 'Bánh mì',
        don_vi_tinh_id: 'donvi012',
        don_gia: 10.0,
      },
      {
        mathang_id: 'mh014',
        ten: 'Bánh quy',
        don_vi_tinh_id: 'donvi002',
        don_gia: 50.0,
      },
      {
        mathang_id: 'mh015',
        ten: 'Nước mắm',
        don_vi_tinh_id: 'donvi009',
        don_gia: 50.0,
      },
      {
        mathang_id: 'mh016',
        ten: 'Bột giặt',
        don_vi_tinh_id: 'donvi001',
        don_gia: 30.0,
      },
      {
        mathang_id: 'mh017',
        ten: 'Nước rửa chén',
        don_vi_tinh_id: 'donvi010',
        don_gia: 20.0,
      },
      {
        mathang_id: 'mh018',
        ten: 'Kem đánh răng',
        don_vi_tinh_id: 'donvi002',
        don_gia: 30.0,
      },
      {
        mathang_id: 'mh019',
        ten: 'Xà phòng',
        don_vi_tinh_id: 'donvi012',
        don_gia: 5.0,
      },
      {
        mathang_id: 'mh020',
        ten: 'Mì gói',
        don_vi_tinh_id: 'donvi012',
        don_gia: 5.0,
      },
      {
        mathang_id: 'mh021',
        ten: 'Cà phê',
        don_vi_tinh_id: 'donvi002',
        don_gia: 20.0,
      },
      {
        mathang_id: 'mh022',
        ten: 'Bột mì',
        don_vi_tinh_id: 'donvi001',
        don_gia: 25.0,
      },
      {
        mathang_id: 'mh023',
        ten: 'Gạo nếp',
        don_vi_tinh_id: 'donvi001',
        don_gia: 18.0,
      },
      {
        mathang_id: 'mh024',
        ten: 'Nước hoa',
        don_vi_tinh_id: 'donvi010',
        don_gia: 200.0,
      },
      {
        mathang_id: 'mh025',
        ten: 'Giấy vệ sinh',
        don_vi_tinh_id: 'donvi012',
        don_gia: 10.0,
      },
      {
        mathang_id: 'mh026',
        ten: 'Khẩu trang',
        don_vi_tinh_id: 'donvi012',
        don_gia: 3.0,
      },
      {
        mathang_id: 'mh027',
        ten: 'Khăn giấy',
        don_vi_tinh_id: 'donvi012',
        don_gia: 5.0,
      },
      {
        mathang_id: 'mh028',
        ten: 'Nước tương',
        don_vi_tinh_id: 'donvi009',
        don_gia: 40.0,
      },
      {
        mathang_id: 'mh029',
        ten: 'Mực in',
        don_vi_tinh_id: 'donvi010',
        don_gia: 150.0,
      },
      {
        mathang_id: 'mh030',
        ten: 'Xi măng',
        don_vi_tinh_id: 'donvi001',
        don_gia: 120.0,
      },
      {
        mathang_id: 'mh031',
        ten: 'Gạch',
        don_vi_tinh_id: 'donvi012',
        don_gia: 2.0,
      },
      {
        mathang_id: 'mh032',
        ten: 'Cát xây dựng',
        don_vi_tinh_id: 'donvi008',
        don_gia: 300.0,
      },
      {
        mathang_id: 'mh033',
        ten: 'Thép cây',
        don_vi_tinh_id: 'donvi007',
        don_gia: 300.0,
      },
      {
        mathang_id: 'mh034',
        ten: 'Ván ép',
        don_vi_tinh_id: 'donvi007',
        don_gia: 150.0,
      },
      {
        mathang_id: 'mh035',
        ten: 'Dây điện',
        don_vi_tinh_id: 'donvi007',
        don_gia: 100.0,
      },
      {
        mathang_id: 'mh036',
        ten: 'Đinh vít',
        don_vi_tinh_id: 'donvi012',
        don_gia: 5.0,
      },
      {
        mathang_id: 'mh037',
        ten: 'Bóng đèn',
        don_vi_tinh_id: 'donvi012',
        don_gia: 40.0,
      },
      {
        mathang_id: 'mh038',
        ten: 'Quạt điện',
        don_vi_tinh_id: 'donvi012',
        don_gia: 150.0,
      },
      {
        mathang_id: 'mh039',
        ten: 'Nồi cơm điện',
        don_vi_tinh_id: 'donvi012',
        don_gia: 750.0,
      },
      {
        mathang_id: 'mh040',
        ten: 'Bếp gas',
        don_vi_tinh_id: 'donvi012',
        don_gia: 1000.0,
      },
      {
        mathang_id: 'mh041',
        ten: 'Máy giặt',
        don_vi_tinh_id: 'donvi012',
        don_gia: 5000.0,
      },
      {
        mathang_id: 'mh042',
        ten: 'Tủ lạnh',
        don_vi_tinh_id: 'donvi012',
        don_gia: 11000.0,
      },
      {
        mathang_id: 'mh043',
        ten: 'Điều hòa',
        don_vi_tinh_id: 'donvi012',
        don_gia: 12000.0,
      },
      {
        mathang_id: 'mh044',
        ten: 'Tivi',
        don_vi_tinh_id: 'donvi012',
        don_gia: 10000.0,
      },
      {
        mathang_id: 'mh045',
        ten: 'Laptop',
        don_vi_tinh_id: 'donvi012',
        don_gia: 15000.0,
      },
      {
        mathang_id: 'mh046',
        ten: 'Chuột máy tính',
        don_vi_tinh_id: 'donvi012',
        don_gia: 200.0,
      },
      {
        mathang_id: 'mh047',
        ten: 'Bàn phím',
        don_vi_tinh_id: 'donvi012',
        don_gia: 300.0,
      },
      {
        mathang_id: 'mh048',
        ten: 'USB',
        don_vi_tinh_id: 'donvi012',
        don_gia: 150.0,
      },
      {
        mathang_id: 'mh049',
        ten: 'Ổ cứng',
        don_vi_tinh_id: 'donvi012',
        don_gia: 1000.0,
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
  const randomNhanViens = await generateRandomNhanVien(50);
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
  .finally(() => {
    void prisma.$disconnect();
    process.exit(0);
  });
