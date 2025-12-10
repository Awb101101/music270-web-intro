function nextLetter(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

export const blocks = []
const numBlocks = 8
const canvasWidth = 600
const canvasHeight = 400
const numCols = 4
const numRows = 2

let currentX = 0
let currentY = 0
for (let i = 0; i < numBlocks; i++) {
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

let letter = "C"
for (let block of blocks) {
    block.note =  letter
    if (letter === "G") {
        letter = "A"
    } else {
        letter = nextLetter(letter)
    }
    console.log(block)
}