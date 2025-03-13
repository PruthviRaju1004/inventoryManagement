-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "dunsNumber" TEXT,
ADD COLUMN     "legalProofs" JSONB,
ADD COLUMN     "socialMedia" JSONB,
ADD COLUMN     "taxId" TEXT,
ADD COLUMN     "website" TEXT;
