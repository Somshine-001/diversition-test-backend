/*
  Warnings:

  - You are about to drop the column `image` on the `opinions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "opinions" DROP COLUMN "image";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0;
