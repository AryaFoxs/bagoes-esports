/*
  Warnings:

  - You are about to drop the column `profile_id` on the `event_registrations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[event_id,user_id]` on the table `event_registrations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `event_registrations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "event_registrations" DROP CONSTRAINT "event_registrations_profile_id_fkey";

-- DropIndex
DROP INDEX "event_registrations_event_id_profile_id_key";

-- AlterTable
ALTER TABLE "event_registrations" DROP COLUMN "profile_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "event_registrations_event_id_user_id_key" ON "event_registrations"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
