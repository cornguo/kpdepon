$(document).keydown(function(e) {
    if(90 === e.which || 88 === e.which) {
        switch (e.which) {
        case 90:
            play("#pon");
            break;
        case 88:
            play("#ka");
            break;
        }
    }
});

function play(id) {
    stat[id] = 1;
    sounds[id].play();
    $(id).attr("src", "img.gif");
    setTimeout(function () {
        reset(id);
    }, 600);
}

function reset(id) {
    if (1 === stat[id]) {
        $(id).attr("src", "img.jpg");
    }
}

var sounds = [];

sounds["#pon"] = new Howl({
    buffer: true,
    urls: ["pon.wav"]
});

sounds["#ka"] = new Howl({
    buffer: true,
    urls: ["ka.wav"]
});

var stat = [];
stat["#pon"] = 0;
stat["#ka"] = 0;

$(document).ready(function (){
    $("#pon").click(function () {play("#pon");});
    $("#ka").click(function () {play("#ka");});
});
