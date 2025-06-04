/*
  Warnings:

  - A unique constraint covering the columns `[loai_daily_id]` on the table `Quy_Dinh_1` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Quy_Dinh_1_loai_daily_id_key" ON "Quy_Dinh_1"("loai_daily_id");
