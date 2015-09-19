var timerID = null;
var interval = 100;

self.onmessage = function (e) {
    if ('start' === e.data) {
        console.log('starting');
        timerID = setInterval(function () {
            postMessage('tick');
        }, interval);
    } else if (e.data.interval) {
        console.log('setting interval');
        interval = e.data.interval;
        console.log('interval=' + interval);
        if (timerID) {
            clearInterval(timerID);
            timerID = setInterval(function () {
                postMessage('tick');
            }, interval)
        }
    } else if ('stop' === e.data) {
        console.log('stopping');
        clearInterval(timerID);
        timerID=null;
    }
};
