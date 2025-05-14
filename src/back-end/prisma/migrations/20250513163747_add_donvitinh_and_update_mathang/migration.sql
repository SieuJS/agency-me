/*
  Warnings:

  - You are about to drop the column `don_vi_tinh` on the `MatHang` table. All the data in the column will be lost.
  - Added the required column `don_vi_tinh_id` to the `MatHang` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatHang" DROP COLUMN "don_vi_tinh",
ADD COLUMN     "don_vi_tinh_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DonViTinh" (
    "don_vi_tinh_id" TEXT NOT NULL,
    "ky_hieu" TEXT NOT NULL,
    "loai_don_vi" TEXT NOT NULL DEFAULT 'Ví dụ: Đo độ dài',

    CONSTRAINT "DonViTinh_pkey" PRIMARY KEY ("don_vi_tinh_id")
);

-- AddForeignKey
ALTER TABLE "MatHang" ADD CONSTRAINT "MatHang_don_vi_tinh_id_fkey" FOREIGN KEY ("don_vi_tinh_id") REFERENCES "DonViTinh"("don_vi_tinh_id") ON DELETE RESTRICT ON UPDATE CASCADE;
