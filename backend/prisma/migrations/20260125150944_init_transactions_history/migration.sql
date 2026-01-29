-- CreateTable
CREATE TABLE "TransactionsHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL,
    "statusCode" TEXT NOT NULL,

    CONSTRAINT "TransactionsHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionsHistory" ADD CONSTRAINT "TransactionsHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
