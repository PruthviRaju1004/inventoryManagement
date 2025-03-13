-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER', 'MANAGER');

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "organization_id" INTEGER,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20),
    "username" VARCHAR(50) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_date" TIMESTAMP(3),
    "updated_by" INTEGER,
    "last_login" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
