/*
  Warnings:

  - Added the required column `ten_don_vi` to the `DonViTinh` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DonViTinh" ADD COLUMN     "ten_don_vi" TEXT NOT NULL;
