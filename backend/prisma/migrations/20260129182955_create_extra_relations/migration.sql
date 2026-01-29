-- AddForeignKey
ALTER TABLE "TransactionsHistory" ADD CONSTRAINT "TransactionsHistory_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
