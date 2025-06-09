/*
  Warnings:

  - You are about to drop the column `loai_daily_id` on the `Quy_Dinh_1` table. All the data in the column will be lost.
  - You are about to drop the column `tien_no_toi_da` on the `Quy_Dinh_1` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Quy_Dinh_1_loai_daily_id_key";

-- AlterTable
ALTER TABLE "DaiLy" ADD COLUMN     "da_xoa" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quy_Dinh_1" DROP COLUMN "loai_daily_id",
DROP COLUMN "tien_no_toi_da";
