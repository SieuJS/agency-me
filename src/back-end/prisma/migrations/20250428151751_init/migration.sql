/*
  Warnings:

  - You are about to alter the column `don_gia` on the `ChiTietPhieuXuat` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `thanh_tien` on the `ChiTietPhieuXuat` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tien_no` on the `DaiLy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tien_no_toi_da` on the `LoaiDaiLy` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `don_gia` on the `MatHang` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `so_tien_thu` on the `PhieuThuTien` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `tien_no_toi_da` on the `Quy_Dinh_1` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "ChiTietPhieuXuat" ALTER COLUMN "don_gia" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "thanh_tien" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "DaiLy" ALTER COLUMN "tien_no" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "LoaiDaiLy" ALTER COLUMN "tien_no_toi_da" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "MatHang" ALTER COLUMN "don_gia" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "PhieuThuTien" ALTER COLUMN "so_tien_thu" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Quy_Dinh_1" ALTER COLUMN "tien_no_toi_da" SET DATA TYPE DOUBLE PRECISION;
