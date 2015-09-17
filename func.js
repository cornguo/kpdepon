$(document).keydown(function (e) {
    switch (e.which) {
    // x .
    case 88:
    case 190:
        play(".pon");
        break;
    // a and '
    case 65:
    case 222:
        play(".ka");
        break;
    }
});

function play(id) {
    sounds[id].play();
    if (1 === stat[id]) {
        $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
        setTimeout(function () {
            $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
        }, 20);
        setTimeout(function () {
            reset(id);
        }, 60);
    } else {
        $(id).attr("src", "./imgs/animate.gif").addClass("glowing");
        setTimeout(function () {
            $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
        }, 100);
        stat[id] = 1;
    }
}

function reset(id) {
    $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
    stat[id] = 0;
}

var sounds = [];

sounds[".pon"] = new Howl({
    buffer: true,
    urls: ["pon.wav"],
    onend: function () {
        reset(".pon")
    }
});

sounds[".ka"] = new Howl({
    buffer: true,
    urls: ["ka.wav"],
    onend: function () {
        reset(".ka")
    }
});

var stat = [];
stat[".pon"] = 0;
stat[".ka"] = 0;

$(document).ready(function () {
    var clickType = ((null !== document.ontouchstart)? "click":"touchstart");
    $(".pon").bind(clickType, function () {play(".pon");});
    $(".ka").bind(clickType, function () {play(".ka");});
    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);
});
