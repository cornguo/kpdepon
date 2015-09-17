$(document).keydown(function (e) {
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
    $(id).attr("src", "img.gif").addClass("glowing");
    setTimeout(function () {
        reset(id);
    }, 400);
}

function reset(id) {
    if (1 === stat[id]) {
        $(id).attr("src", "img.jpg").removeClass("glowing");
        stat[id] = 0;
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

$(document).ready(function () {
    var clickType = ((null !== document.ontouchstart)? "click":"touchstart");
    $("#pon").bind(clickType, function () {play("#pon");});
    $("#ka").bind(clickType, function () {play("#ka");});
    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);
});
