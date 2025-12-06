import { playNote } from "./script.js";

function nextLetter(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

const cells = document.getElementsByClassName("cell")

for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]
    cell.addEventListener("click", () => playNote(`C${i}`, "8n"));
}

export const blocks = []
const canvasWidth = 600
const canvasHeight = 400
const numCols = 4
const numRows = 2

let currentX = 0
let currentY = 0
for (let i = 0; i < cells.length; i++) {
    blocks[i] = [currentX, currentY]
    blocks[i] = {
        xMin: currentX,
        xMax: currentX + canvasWidth / numCols,
        yMin: currentY,
        yMax: currentY + canvasHeight / numRows
    }
    currentX += canvasWidth / numCols
    if (currentX === canvasWidth) {
        currentX = 0
        currentY += canvasHeight / numRows
    }
}

let letter = "A"
for (let block of blocks) {
    block.note =  `${letter}4`
    if (letter === "G") {
        letter = "A"
    } else {
        letter = nextLetter(letter)
    }
    console.log(block)
}