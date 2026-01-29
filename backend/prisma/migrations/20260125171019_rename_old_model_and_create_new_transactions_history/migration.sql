/*
  Warnings:

  - You are about to drop the column `method` on the `TransactionsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `TransactionsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `TransactionsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `urlPath` on the `TransactionsHistory` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `TransactionsHistory` table. All the data in the column will be lost.
  - Added the required column `amount` to the `TransactionsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `TransactionsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `TransactionsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `TransactionsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `TransactionsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TransactionsHistory" DROP CONSTRAINT "TransactionsHistory_userId_fkey";

-- AlterTable
ALTER TABLE "TransactionsHistory" DROP COLUMN "method",
DROP COLUMN "statusCode",
DROP COLUMN "time",
DROP COLUMN "urlPath",
DROP COLUMN "userId",
ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "receiverId" INTEGER NOT NULL,
ADD COLUMN     "senderId" INTEGER NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "LoggingHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL,
    "statusCode" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoggingHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoggingHistory" ADD CONSTRAINT "LoggingHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionsHistory" ADD CONSTRAINT "TransactionsHistory_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
