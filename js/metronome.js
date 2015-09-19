var metronome = {

    controller: null,
    audioContext: null,
    nextNoteTime: 0.0,
    timerWorker: null,
    tempo: 120.0,
    lookahead: 15.0,
    scheduleAheadTime: 0.2,
    score: '',
    currentNote: 0,
    isPlaying: false,
    statCallback: function (curr, len) {},

    nextNote: function () {
        var secondsPerBeat = 60.0 / this.tempo;
        this.nextNoteTime += 0.25 * secondsPerBeat;
        this.currentNote++;
    },

    playNote: function () {
        var pos = parseInt(this.currentNote);
        var len = this.score.length;

        if (pos > len) {
            this.stop();
            return;
        }

        switch (this.score[pos]) {
        case 'k':
            this.controller.play('.ka');
            break;
        case 'p':
            this.controller.play('.pon');
            break;
        }

        this.statCallback(pos, len);
    },

    scheduler: function () {
        while (this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime) {
            this.playNote();
            this.nextNote();
        }
    },

    play: function (score) {
        if (!this.isPlaying) {
            if (undefined !== score) {
                this.score = score;
            }

            this.isPlaying = true;
            this.currentNote = -1;
            this.nextNoteTime = this.audioContext.currentTime;
            this.timerWorker.postMessage('start');
        }
    },

    stop: function () {
        this.isPlaying = false;
        this.timerWorker.postMessage('stop');
    },

    init: function (controller) {
        var el = this;

        this.controller = controller;
        this.audioContext = new AudioContext();

        this.timerWorker = new Worker('js/metronomeworker.js');

        this.timerWorker.onmessage = function(e) {
            if (e.data == 'tick') {
                el.scheduler();
            } else {
                console.log('message:' + e.data);
            }
        };

        this.timerWorker.postMessage({ interval: this.lookahead });
    },

};
