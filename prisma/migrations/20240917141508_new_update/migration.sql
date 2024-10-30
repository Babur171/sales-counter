/*
  Warnings:

  - The values [MALE,FEMALE] on the enum `GenderType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GenderType_new" AS ENUM ('male', 'female', 'kids', 'others');
ALTER TABLE "Product" ALTER COLUMN "genderType" TYPE "GenderType_new" USING ("genderType"::text::"GenderType_new");
ALTER TYPE "GenderType" RENAME TO "GenderType_old";
ALTER TYPE "GenderType_new" RENAME TO "GenderType";
DROP TYPE "GenderType_old";
COMMIT;
