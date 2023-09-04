-- CreateTable
CREATE TABLE "cars" (
    "id" SERIAL NOT NULL,
    "model" TEXT NOT NULL,
    "yom" TEXT NOT NULL,
    "is_electric" BOOLEAN NOT NULL,
    "battery_cap" TEXT NOT NULL,
    "engine_cap" TEXT NOT NULL,
    "mpg" TEXT NOT NULL,
    "range" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
