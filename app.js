const fs = require("fs/promises");
const path = require("path");

async function createFoldersAndFiles() {
    try {
        await fs.mkdir(path.join(__dirname, "dir1"));

        for (let i = 0; i < 5; i++) {
            await fs.mkdir(path.join(__dirname, "dir1", `dir${i+2}`));
            await fs.writeFile(path.join(__dirname, "dir1", `file${i+1}.txt`), "text");
        }

        console.log("Створено папку та 5 папок та файлів всередині.");

        await checkFolderContents();
    } catch (error) {
        console.error('Виникла помилка при створенні папок та файлів:', error);
    }
};

async function checkFolderContents() {
    try {
        const data = await fs.readdir(path.join(__dirname, "dir1"), { withFileTypes: true });

        data.forEach(item => {
            if (item.isDirectory()) {
                console.log(`FOLDER: ${item.name}`);
            } else {
                console.log(`FILE: ${item.name}`);
            }
        });
    } catch (error) {
        console.error('Виникла помилка при читанні папки:', error);
    }
}

createFoldersAndFiles();
