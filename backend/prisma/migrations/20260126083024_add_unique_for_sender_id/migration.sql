/*
  Warnings:

  - A unique constraint covering the columns `[senderId]` on the table `TransactionsHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransactionsHistory_senderId_key" ON "TransactionsHistory"("senderId");
