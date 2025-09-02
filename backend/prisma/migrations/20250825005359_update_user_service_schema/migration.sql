/*
  Warnings:

  - Changed the type of `category` on the `Service` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."ServiceCategory" AS ENUM ('MANTENIMIENTO', 'REPARACION', 'DIAGNOSTICO', 'LIMPIEZA', 'OTROS');

-- AlterTable
ALTER TABLE "public"."Service" DROP COLUMN "category",
ADD COLUMN     "category" "public"."ServiceCategory" NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
