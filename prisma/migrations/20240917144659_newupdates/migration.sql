/*
  Warnings:

  - Added the required column `userId` to the `SoldProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SoldProduct" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "SoldProduct" ADD CONSTRAINT "SoldProduct_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
