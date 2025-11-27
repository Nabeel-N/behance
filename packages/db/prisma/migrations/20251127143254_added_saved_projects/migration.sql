-- CreateTable
CREATE TABLE "_savedprojects" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_savedprojects_AB_unique" ON "_savedprojects"("A", "B");

-- CreateIndex
CREATE INDEX "_savedprojects_B_index" ON "_savedprojects"("B");

-- AddForeignKey
ALTER TABLE "_savedprojects" ADD CONSTRAINT "_savedprojects_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_savedprojects" ADD CONSTRAINT "_savedprojects_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
