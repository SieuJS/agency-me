/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Quan" (
    "quan_id" TEXT NOT NULL,
    "ten_quan" TEXT NOT NULL,
    "thanh_pho" TEXT NOT NULL,
    "gioi_han_so_daily" INTEGER NOT NULL,

    CONSTRAINT "Quan_pkey" PRIMARY KEY ("quan_id")
);

-- CreateTable
CREATE TABLE "LoaiDaiLy" (
    "loai_daily_id" TEXT NOT NULL,
    "ten_loai" TEXT NOT NULL,
    "tien_no_toi_da" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "LoaiDaiLy_pkey" PRIMARY KEY ("loai_daily_id")
);

-- CreateTable
CREATE TABLE "DaiLy" (
    "daily_id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "dien_thoai" TEXT NOT NULL,
    "dia_chi" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "quan_id" TEXT NOT NULL,
    "loai_daily_id" TEXT NOT NULL,
    "tien_no" DECIMAL(65,30) NOT NULL,
    "ngay_tiep_nhan" TIMESTAMP(3) NOT NULL,
    "nhan_vien_tiep_nhan" TEXT NOT NULL,

    CONSTRAINT "DaiLy_pkey" PRIMARY KEY ("daily_id")
);

-- CreateTable
CREATE TABLE "MatHang" (
    "mathang_id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "don_vi_tinh" TEXT NOT NULL,
    "don_gia" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "MatHang_pkey" PRIMARY KEY ("mathang_id")
);

-- CreateTable
CREATE TABLE "LoaiNhanVien" (
    "loai_nhan_vien_id" TEXT NOT NULL,
    "ten_loai" TEXT NOT NULL,
    "mo_ta" TEXT NOT NULL,

    CONSTRAINT "LoaiNhanVien_pkey" PRIMARY KEY ("loai_nhan_vien_id")
);

-- CreateTable
CREATE TABLE "NhanVien" (
    "nhan_vien_id" TEXT NOT NULL,
    "ten" TEXT NOT NULL,
    "dien_thoai" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "loai_nhan_vien_id" TEXT NOT NULL,
    "dia_chi" TEXT NOT NULL,
    "mat_khau" TEXT NOT NULL,
    "ngay_them" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NhanVien_pkey" PRIMARY KEY ("nhan_vien_id")
);

-- CreateTable
CREATE TABLE "PhieuXuatHang" (
    "phieu_id" TEXT NOT NULL,
    "daily_id" TEXT NOT NULL,
    "ngay_lap_phieu" TIMESTAMP(3) NOT NULL,
    "nhan_vien_lap_phieu" TEXT NOT NULL,

    CONSTRAINT "PhieuXuatHang_pkey" PRIMARY KEY ("phieu_id")
);

-- CreateTable
CREATE TABLE "ChiTietPhieuXuat" (
    "phieu_id" TEXT NOT NULL,
    "mathang_id" TEXT NOT NULL,
    "so_luong" INTEGER NOT NULL,
    "don_gia" DECIMAL(65,30) NOT NULL,
    "thanh_tien" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "ChiTietPhieuXuat_pkey" PRIMARY KEY ("phieu_id","mathang_id")
);

-- CreateTable
CREATE TABLE "PhieuThuTien" (
    "phieu_thu_id" TEXT NOT NULL,
    "daily_id" TEXT NOT NULL,
    "ngay_thu" TIMESTAMP(3) NOT NULL,
    "so_tien_thu" DECIMAL(65,30) NOT NULL,
    "nhan_vien_thu_tien" TEXT NOT NULL,

    CONSTRAINT "PhieuThuTien_pkey" PRIMARY KEY ("phieu_thu_id")
);

-- CreateTable
CREATE TABLE "Quyen" (
    "quyen_id" TEXT NOT NULL,
    "ten_quyen" TEXT NOT NULL,
    "mo_ta" TEXT NOT NULL,

    CONSTRAINT "Quyen_pkey" PRIMARY KEY ("quyen_id")
);

-- CreateTable
CREATE TABLE "NhanVien_Quyen" (
    "nhan_vien_id" TEXT NOT NULL,
    "quyen_id" TEXT NOT NULL,

    CONSTRAINT "NhanVien_Quyen_pkey" PRIMARY KEY ("nhan_vien_id","quyen_id")
);

-- CreateTable
CREATE TABLE "Quy_Dinh_1" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "so_luong_cac_loai_daily" INTEGER NOT NULL,
    "so_dai_ly_toi_da_trong_quan" INTEGER NOT NULL,
    "so_luong_mat_hang_toi_da" INTEGER NOT NULL,
    "so_luong_don_vi_tinh" INTEGER NOT NULL,
    "loai_daily_id" TEXT NOT NULL,
    "tien_no_toi_da" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Quy_Dinh_1_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NhanVien_email_key" ON "NhanVien"("email");

-- AddForeignKey
ALTER TABLE "DaiLy" ADD CONSTRAINT "DaiLy_nhan_vien_tiep_nhan_fkey" FOREIGN KEY ("nhan_vien_tiep_nhan") REFERENCES "NhanVien"("nhan_vien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaiLy" ADD CONSTRAINT "DaiLy_quan_id_fkey" FOREIGN KEY ("quan_id") REFERENCES "Quan"("quan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DaiLy" ADD CONSTRAINT "DaiLy_loai_daily_id_fkey" FOREIGN KEY ("loai_daily_id") REFERENCES "LoaiDaiLy"("loai_daily_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhanVien" ADD CONSTRAINT "NhanVien_loai_nhan_vien_id_fkey" FOREIGN KEY ("loai_nhan_vien_id") REFERENCES "LoaiNhanVien"("loai_nhan_vien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuXuatHang" ADD CONSTRAINT "PhieuXuatHang_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "DaiLy"("daily_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuXuatHang" ADD CONSTRAINT "PhieuXuatHang_nhan_vien_lap_phieu_fkey" FOREIGN KEY ("nhan_vien_lap_phieu") REFERENCES "NhanVien"("nhan_vien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietPhieuXuat" ADD CONSTRAINT "ChiTietPhieuXuat_phieu_id_fkey" FOREIGN KEY ("phieu_id") REFERENCES "PhieuXuatHang"("phieu_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChiTietPhieuXuat" ADD CONSTRAINT "ChiTietPhieuXuat_mathang_id_fkey" FOREIGN KEY ("mathang_id") REFERENCES "MatHang"("mathang_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuThuTien" ADD CONSTRAINT "PhieuThuTien_daily_id_fkey" FOREIGN KEY ("daily_id") REFERENCES "DaiLy"("daily_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhieuThuTien" ADD CONSTRAINT "PhieuThuTien_nhan_vien_thu_tien_fkey" FOREIGN KEY ("nhan_vien_thu_tien") REFERENCES "NhanVien"("nhan_vien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhanVien_Quyen" ADD CONSTRAINT "NhanVien_Quyen_nhan_vien_id_fkey" FOREIGN KEY ("nhan_vien_id") REFERENCES "NhanVien"("nhan_vien_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NhanVien_Quyen" ADD CONSTRAINT "NhanVien_Quyen_quyen_id_fkey" FOREIGN KEY ("quyen_id") REFERENCES "Quyen"("quyen_id") ON DELETE RESTRICT ON UPDATE CASCADE;
