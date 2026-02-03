/*
  Warnings:

  - You are about to drop the column `user_id` on the `profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_user_id_key";

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "user_id";
