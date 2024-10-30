-- CreateTable
CREATE TABLE "NewStock" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewStock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NewStock" ADD CONSTRAINT "NewStock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
