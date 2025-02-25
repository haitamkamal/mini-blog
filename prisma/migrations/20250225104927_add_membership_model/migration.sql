-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "password" TEXT NOT NULL DEFAULT 'admin123',

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);
