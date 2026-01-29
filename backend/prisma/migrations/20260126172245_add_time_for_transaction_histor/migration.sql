-- DropIndex
DROP INDEX "TransactionsHistory_senderId_key";

-- AlterTable
ALTER TABLE "TransactionsHistory" ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
