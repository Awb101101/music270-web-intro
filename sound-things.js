window.stopSound = false

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
                        console.log("Red")
                        blockOrder.push([block.note + "4", 0]);
                        prevNote = block.note + "4"
                    } else if (line.stroke === "blue" && prevNote !== block.note + "5") {
                        console.log("Blue")
                        blockOrder.push([block.note + "5", 0]);
                        prevNote = block.note + "5"
                    } else if (line.stroke === "green" && prevNote !== block.note + "3") {
                        console.log("Green")
                        blockOrder.push([block.note + "3", 0]);
                        prevNote = block.note + "3"
                    } else {
                        let duration = blockOrder.pop()
                        blockOrder.push([duration[0], duration[1] + 0.1])
                    }
                }
            }
        }
    }
    return blockOrder;
}

export function blockOrderToTransport(lines, blocks, synthType="triangle") {
    const blockOrder = getBlocksFromCanvas(lines, blocks);

    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    Tone.Transport.seconds = 0;

    if (window.synth) {
        window.synth.releaseAll();
        window.synth.dispose();
    }

    console.log(blockOrder)
    window.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: {
            type: synthType,
        },
        envelope : {
            attack : 0.01,
            decay : 0.1,
            sustain : 0.3,
            release : 0.3
        }
    }).toDestination();
    window.now = Tone.now();
    let offset = 0;
    let prevNote = null;
    Tone.getDestination().mute = false;
    for (const note of blockOrder) {
        console.log("Playing:", note);

        Tone.Transport.scheduleOnce((time) => {
            const noteLength = String(note[1])
            document.getElementById("playing-note").innerHTML = `<b>Playing ${note[0]} for ${noteLength.slice(0, 4)} seconds.</b>`;
            window.synth.triggerAttack(note[0], time);
        }, offset)

        offset += note[1];

        Tone.Transport.scheduleOnce((time) => {
            window.synth.triggerRelease(note[0], time);
        }, offset);

        prevNote = note[0];
    }
    Tone.Transport.start();
}

export function stopAll() {
    if (window.synth) {
        window.synth.releaseAll()
        window.synth.dispose();
    }
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
}