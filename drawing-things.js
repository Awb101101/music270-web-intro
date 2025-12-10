export function setBrushMode() {
    canvas.isDrawingMode = !canvas.isDrawingMode;
}

export function setEraserMode() {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        if (activeObject.type === 'activeSelection') {
            activeObject.getObjects().forEach(obj => canvas.remove(obj));
            canvas.discardActiveObject();
        } else {
            canvas.remove(activeObject);
        }
    }
}

export function deleteAllCanvas() {
    canvas.getObjects().forEach(obj => canvas.remove(obj));
}

export function changeBrushColor(color) {
    penBrush.color = color;
}

// Initialize Fabric canvas
export const canvas = new fabric.Canvas('canvas');

// Enable free drawing mode
canvas.isDrawingMode = true;

const penBrush = new fabric.PencilBrush(canvas);
penBrush.width = 5;
penBrush.color = 'red';
canvas.freeDrawingBrush = penBrush;

const modeButton = document.getElementById("modeButton");

modeButton.addEventListener("click", () => {
    // Update label based on state
    modeButton.textContent = canvas.isDrawingMode ? "Select" : "Pen";
});

canvas.on('path:created', (event) => {
    console.log('User drew a path:', event.path);
    event.path.isSelectable = true;
    event.path.evented = true;
});