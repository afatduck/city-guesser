-- CreateTable
CREATE TABLE "Credentials" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("username")
);

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_email_key" ON "Credentials"("email");
