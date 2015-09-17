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
    sounds[id].play();
    $(id).attr("src", "img.gif");
}

function reset(id) {
    $(id).attr("src", "img.jpg");
}

var sounds = [];

sounds["#pon"] = new Howl({
    buffer: true,
    urls: ["pon.wav"],
    onend: function () {
        reset("#pon");
    }
});

sounds["#ka"] = new Howl({
    buffer: true,
    urls: ["ka.wav"],
    onend: function () {
        reset("#ka");
    }
});

$(document).ready(function (){
    $("#pon").click(function () {play("#pon");});
    $("#ka").click(function () {play("#ka");});
});
