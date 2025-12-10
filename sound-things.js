export async function startAudio() {
    await Tone.start()
    console.log("Audio Started")
}

export function playNote(note, length) {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, length);
}

export function addToTransport(note, length, loopTime, startTime) {
    const synthA = new Tone.Synth().toDestination();
    const loopA = new Tone.Loop((noteTime) => {
        synthA.triggerAttackRelease(note, length, noteTime)
    }, loopTime).start(startTime)
    // Tone.Transport.start()
}

export function startTransport() {
    Tone.Transport.start()
}

export function testTransport() {
    // create two monophonic synths
    const synthA = new Tone.FMSynth().toDestination();
    const synthB = new Tone.AMSynth().toDestination();
//play a note every quarter-note
    const loopA = new Tone.Loop((time) => {
        synthA.triggerAttackRelease("C2", "8n", time);
    }, "4n").start(0);
//play another note every off quarter-note, by starting it "8n"
    const loopB = new Tone.Loop((time) => {
        synthB.triggerAttackRelease("C4", "8n", time);
    }, "4n").start("8n");
// all loops start when the Transport is started
    Tone.Transport.start();

    Tone.Transport.bpm.value = 80
}

export function stopTransport() {
    Tone.getTransport().stop();
}

export function getBlocksFromCanvas(lines, blocks) {
    console.log("Started running");
    const blockOrder = [];
    const blocksCopy = structuredClone(blocks)
    let prevNote = null;
    for (const line of lines) {
        const path = line.path;
        for (const coords of path) {
            const xCoord = coords[1];
            const yCoord = coords[2];
            for (const block of blocksCopy) {
                if (
                    block.xMin <= xCoord && block.xMax >= xCoord &&
                    block.yMin <= yCoord && block.yMax >= yCoord
                ) {
                    if (line.stroke === "red" && prevNote !== block.note + "4") {
                        blockOrder.push(block.note + "4");
                        prevNote = block.note + "4"
                    } else if (line.stroke === "blue" && prevNote !== block.note + "5") {
                        blockOrder.push(block.note + "5");
                        prevNote = block.note + "5"
                    } else if (line.stroke === "green" && prevNote !== block.note + "3") {
                        blockOrder.push(block.note + "3");
                        prevNote = block.note + "3"
                    }
                }
            }
        }
    }
    return blockOrder;
}

export function blockOrderToTransport(lines, blocks) {
    const blockOrder = getBlocksFromCanvas(lines, blocks);
    console.log(blockOrder)
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    let now = Tone.now();
    let offset = 0
    for (const note of blockOrder) {
        synth.triggerAttack(note, now + offset);
        offset += 0.5;
        console.log("Playing:", note);
    }
    for (const note of blockOrder) {
        synth.triggerRelease(note, now + offset);
    }
}