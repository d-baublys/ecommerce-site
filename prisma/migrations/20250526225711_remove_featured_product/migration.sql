/*
  Warnings:

  - You are about to drop the `FeaturedProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FeaturedProduct" DROP CONSTRAINT "FeaturedProduct_productId_fkey";

-- DropTable
DROP TABLE "FeaturedProduct";
