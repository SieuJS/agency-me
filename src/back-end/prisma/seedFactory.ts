import { faker } from '@faker-js/faker';
// import { faker } from '@faker-js/faker/locale/en';
import * as bcrypt from 'bcrypt';

/**
 * Định nghĩa type cho Nhân viên
 */
interface NhanVien {
    nhan_vien_id: string;
    ten: string;
    dien_thoai: string;
    email: string;
    loai_nhan_vien_id: 'admin' | 'staff';
    dia_chi: string;
    mat_khau: string;
    ngay_them: Date;
}

/**
 * Định nghĩa type cho Đại lý
 */
interface DaiLy {
    daily_id: string;
    ten: string;
    dien_thoai: string;
    dia_chi: string;
    email: string;
    quan_id: string;
    loai_daily_id: 'loai001' | 'loai002';
    tien_no: number;
    ngay_tiep_nhan: Date;
    nhan_vien_tiep_nhan: string;
}

function generateVietnamPhoneNumber() {
    const prefixes = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099'];
    const prefix = faker.helpers.arrayElement(prefixes);
    const number = faker.string.numeric(7); // 7 số còn lại
    return `${prefix}${number}`;
}

function generateVietnamAddress() {
    const streets = [
      'Nguyễn Trãi', 'Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Huệ',
      'Cách Mạng Tháng 8', 'Pasteur', 'Điện Biên Phủ', 'Phan Đình Phùng'
    ];
  
    const cityDistrictMap: Record<string, string[]> = {
      'TP.HCM': ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 7', 'Bình Thạnh', 'Tân Bình'],
      'Hà Nội': ['Đống Đa', 'Ba Đình', 'Hoàn Kiếm', 'Hà Đông', 'Long Biên', 'Nam Từ Liêm', 'Cầu Giấy', 'Thanh Xuân'],
      'Hải Phòng': ['Lê Chân', 'Hải An', 'Ngô Quyền', 'Kiến An', 'Hồng Bàng'],
    };
  
    const cities = Object.keys(cityDistrictMap);
    const city = faker.helpers.arrayElement(cities);
    const district = faker.helpers.arrayElement(cityDistrictMap[city]);
    const street = faker.helpers.arrayElement(streets);
    const houseNumber = faker.number.int({ min: 1, max: 999 });
  
    return `${houseNumber} ${street}, ${district}, ${city}`;
  }
  

export async function generateRandomNhanVien(count: number): Promise<NhanVien[]> {
    const nhanViens: NhanVien[] = [];

    for (let i = 1; i <= count; i++) {
        const password = '123456789';
        const hashedPassword = await bcrypt.hash(password, 10);
        nhanViens.push({
            nhan_vien_id: `nv${i.toString().padStart(3, '0')}`,
            ten: faker.person.fullName(),
            dien_thoai: generateVietnamPhoneNumber(),
            email: faker.internet.email(),
            loai_nhan_vien_id: i <= Math.floor(count * 0.2) ? 'admin' : 'staff', // 20% admin
            dia_chi: generateVietnamAddress(),
            mat_khau: hashedPassword,
            ngay_them: new Date(),
        });
    }
    return nhanViens;
}

export function generateRandomDaiLy(count: number): DaiLy[] {
    const daiLys: DaiLy[] = [];

    const quanIds = ['01', '02', '03', '04', '05', 'dongda', 'hoaniem', 'badinh', 'caugiay', 'longbien', 'hongbang', 'ngoquyen', 'lechan'];
    const nhanVienTiepNhanIds = ['nv002', 'nv003', 'nv004', 'nv005', 'nv006', 'nv007', 'nv008', 'nv009', 'nv010'];

    for (let i = 1; i <= count; i++) {
        daiLys.push({
            daily_id: `daily${i.toString().padStart(3, '0')}`,
            ten: `Đại Lý ${faker.company.name()}`,
            dien_thoai: generateVietnamPhoneNumber(),
            dia_chi: generateVietnamAddress(),
            email: faker.internet.email(),
            quan_id: faker.helpers.arrayElement(quanIds),
            loai_daily_id: faker.helpers.arrayElement(['loai001', 'loai002']),
            tien_no: faker.number.int({ min: 0, max: 500000 }),
            ngay_tiep_nhan: new Date(),
            nhan_vien_tiep_nhan: faker.helpers.arrayElement(nhanVienTiepNhanIds),
        });
    }
    return daiLys;
}
