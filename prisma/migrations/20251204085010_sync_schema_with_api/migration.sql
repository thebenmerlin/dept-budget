/*
  Warnings:

  - The `activity` column on the `expenses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[budgetId,category]` on the table `category_budgets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `category_budgets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `expenses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('MEETING', 'PURCHASE', 'EVENT', 'TRAVEL', 'OTHER');

-- AlterTable
ALTER TABLE "budgets" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "category_budgets" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "expenses" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "activity",
ADD COLUMN     "activity" "ActivityType";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_budgets_budgetId_category_key" ON "category_budgets"("budgetId", "category");
