const express = require('express');
const app = express();

const fs = require("fs");
const path = require("path");

const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(PORT, () => {
    console.log(`Server has started on PORT ${PORT}`);
});

//GET
app.get('/characters', async (req, res) => {
    try {
        const characters = await fs.promises.readFile(path.join(__dirname, "characters.json"), { encoding: "utf-8" });
        const jsonCharacters = JSON.parse(characters);
        console.log(jsonCharacters);
        res.status(200).json(jsonCharacters);
    } catch (err) {
        console.error(err);
    }
});

app.get('/characters/:id', async (req, res) => {
    try {
        const characters = await fs.promises.readFile(path.join(__dirname, "characters.json"), { encoding: "utf-8" });
        const jsonCharacter = JSON.parse(characters);
        const character = jsonCharacter[req.params.id];
        character ? res.status(200).json(character) : res.json("No such user");
    } catch (err) {
        console.error(err);
    }
});

//POST
app.post('/characters', async (req, res) => {
    try {
        const characters = await fs.promises.readFile(path.join(__dirname, "characters.json"), { encoding: "utf-8" });
        const jsonCharacters = JSON.parse(characters);

        const newCharacter = req.body;

        if (newCharacter.name.length < 3 || newCharacter.gender.length < 4) {
            return res.status(400).json({
                message: "Not valid data"
            })
        }

        jsonCharacters.push(newCharacter);
        fs.promises.writeFile(path.join(__dirname, "characters.json"), JSON.stringify(jsonCharacters), { encoding: "utf-8" })
            .then(() => {
                res.status(200).json({
                    message: "User added successfully",
                    data: newCharacter
                });
            })

    } catch (err) {
        console.error(err);
    }
});


//PUT
app.put('/characters/:id', async (req, res) => {
    try {
        const characters = await fs.promises.readFile(path.join(__dirname, "characters.json"), { encoding: "utf-8" });
        const jsonCharacters = JSON.parse(characters);
        const updatedCharacter = req.body;

        if (jsonCharacters[req.params.id]) {
            jsonCharacters[req.params.id] = updatedCharacter;

            fs.promises.writeFile(path.join(__dirname, "characters.json"), JSON.stringify(jsonCharacters), { encoding: "utf-8" })
                .then(() => {
                    res.status(200).json({
                        message: "Character updated",
                        data: updatedCharacter
                    });
                })
        } else {
            res.json({
                message: "incorrect id"
            })
        }
    } catch (err) {
        console.error(err);
    }
});

//DELETE
app.delete('/characters/:id', async (req, res) => {
    try {
        const characters = await fs.promises.readFile(path.join(__dirname, "characters.json"), { encoding: "utf-8" });
        const jsonCharacters = JSON.parse(characters);

        if (jsonCharacters[req.params.id]) {
            const character = jsonCharacters[req.params.id];
            const filteredCharaters = JSON.stringify(jsonCharacters.filter(item => item !== character));

            fs.promises.writeFile(path.join(__dirname, "characters.json"), filteredCharaters, { encoding: "utf-8" })
                .then(() => {
                    res.status(200).json({
                        message: "User deleted",
                        data: character
                    });
                })
        }
    } catch (err) {
        console.error(err);
    }
});