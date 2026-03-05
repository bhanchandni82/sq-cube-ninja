// Simple Sound Synthesizer using Web Audio API

let audioCtx;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

export function playSound(type) {
    try {
        const ctx = getContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === 'click') {
            // Short blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
        }
        else if (type === 'correct') {
            // Happy chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.setValueAtTime(554.37, now + 0.1); // C#
            osc.frequency.setValueAtTime(659.25, now + 0.2); // E

            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.linearRampToValueAtTime(0.2, now + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

            osc.start(now);
            osc.stop(now + 0.4);
        }
        else if (type === 'wrong') {
            // Low buzz
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);

            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        }
        else if (type === 'level-up') {
            // Triumphant arpeggio
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, now);      // A4
            osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
            osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
            osc.frequency.setValueAtTime(880, now + 0.3);    // A5

            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.linearRampToValueAtTime(0.1, now + 0.2);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

            osc.start(now);
            osc.stop(now + 0.6);
        }
    } catch (e) {
        console.log("Audio not supported or blocked", e);
    }
}
