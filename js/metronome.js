var metronome = {
    controller: null,
    audioContext: null,
    nextNoteTime: 0.0,
    notesInQueue: [],
    timerWorker: null,
    tempo: 120.0,
    lookahead: 15.0,
    scheduleAheadTime: 0.2,
    score: '',
    currentNote: 0,
    isPlaying: false,
    nextNote: function () {
        var secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += 0.25 * secondsPerBeat;

        this.currentNote++;
    },

    scheduleNote: function (beatNumber, time) {
        // push the note on the queue, even if we're not playing.
        this.notesInQueue.push( { note: beatNumber, time: time } );

        var pos = parseInt(this.currentNote);

        if (pos > this.score.length) {
            this.stop();
            return;
        }

        switch (this.score[pos]) {
        case "k":
            this.controller.play(".ka");
            break;
        case "p":
            this.controller.play(".pon");
            break;
        }
    },

    scheduler: function () {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
            this.scheduleNote( this.currentNote % 16, this.nextNoteTime );
            this.nextNote();
        }
    },

    play: function (score) {
        if (!this.isPlaying) { // start playing
            if (score) {
                this.score = score;
            }

            this.isPlaying = true;
            this.currentNote = -1;
            this.nextNoteTime = this.audioContext.currentTime;
            this.timerWorker.postMessage("start");
        }
    },

    stop: function () {
        this.isPlaying = false;
        this.timerWorker.postMessage("stop");
    },

    init: function (controller) {
        this.controller = controller;
        this.audioContext = new AudioContext();

        this.timerWorker = new Worker("js/metronomeworker.js");

        this.timerWorker.onmessage = function(e) {
            if (e.data == "tick") {
                metronome.scheduler();
            } else {
                console.log("message:" + e.data);
            }
        };

        this.timerWorker.postMessage({"interval": this.lookahead});

    }
};
