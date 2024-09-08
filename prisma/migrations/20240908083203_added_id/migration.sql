/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[productId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "productId" DROP DEFAULT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_productId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Product_productId_key" ON "Product"("productId");
