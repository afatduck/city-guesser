/*
  Warnings:

  - You are about to drop the column `best_score` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total_score` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" RENAME COLUMN "best_score" TO "bestScore";
ALTER TABLE "User" RENAME COLUMN "total_score" TO "totalScore";
