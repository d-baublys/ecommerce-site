-- CreateEnum
CREATE TYPE "Sizes" AS ENUM ('xs', 's', 'm', 'l', 'xl', 'xxl');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('mens', 'womens');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "price" INTEGER NOT NULL,
    "slug" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "alt" TEXT NOT NULL,
    "stock" JSONB NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
