$(document).ready(function () {

    // status register
    var stat = {
        ".pon": 0,
        ".ka": 0,
        "key": "-",
        "player": 0
    };

    // set animation delay by screen type (i think it's buggy)
    var delay = (null === document.ontouchstart)? [10, 80, 80, 200]:[20,250,100,250];

    // layout
    var animationWidth = $("#animation").width();
    var dimension = [animationWidth / 4, animationWidth * 3 / 16];

    // audio fx controller
    var controller = {
        play: function (id) {
            var el = this;
            this.sounds[id].play();
            stat["key"] = id[1];
            setTimeout(function () {
                stat["key"] = "-";
            }, 100);
            if (0 !== stat[id]) {
                el.reset(id);
                setTimeout(function () {
                    $(id).attr("src", "./imgs/down.jpg").addClass("glowing");
                }, delay[0]);
                stat[id] = setTimeout(function () {
                    el.reset(id);
                }, delay[1]);
            } else {
                $(id).attr("src", "./imgs/animate.gif").addClass("glowing");
                setTimeout(function () {
                    $(id).attr("src", "./imgs/down.jpg");
                }, delay[2]);
                stat[id] = setTimeout(function () {
                    el.reset(id);
                }, delay[3]);
            }
        },

        reset: function (id) {
            clearTimeout(stat[id]);
            $(id).attr("src", "./imgs/init.jpg").removeClass("glowing");
            stat[id] = 0;
        },

        // sounds
        sounds: {
            ".pon": new Howl({
                buffer: true,
                urls: ["./convert/pon.ogg", "./convert/pon.mp3"],
            }),
            ".ka": new Howl({
                buffer: true,
                urls: ["./convert/ka.ogg", "./convert/ka.mp3"],
            })
        }

    };

    // expermintal player
    var player = {
        logRecordText: function (key) {
            $("#recordText").val($("#recordText").val() + key);
        },

        playRecordText: function (pos) {
            this.stopRecordText();
            metronome.tempo = parseInt($("#tempo").val());
            metronome.play($("#recordText").val());
        },

        stopRecordText: function (pos) {
            clearInterval(stat["player"]);
            metronome.stop();
            $("#recordText").val(
                $("#recordText").val().replace(/[^-kp]/g, '').replace(/^-+/, '').replace(/-+$/, '')
            );
        }
    };

    // youtube player
    var yt_player = {
        playBGM: function (vidId) {
            var player = new YT.Player('yt_video', {
                height: dimension[0] + 20,
                width: dimension[1] + 80,
                videoId: vidId,
                events: {
                    onReady: function(e) {
                        console.log("BGM playing");
                        e.target.playVideo();
                    },
                    onStateChange: function(e) {
                        if(e.data == YT.PlayerState.ENDED) {
                            console.log("BGM stopped");
                        }
                    }
                }
            });
            $("#yt_video").width(dimension[0] + 80).height(dimension[1] + 20).show();
            $(".ka").width(dimension[0]).height(dimension[1]);
        },

        setBGM: function (vidId) {
            $("#yt_video").hide().replaceWith("<div id=\"yt_video\"></div>");
            this.playBGM(vidId);
        }
    }

    // bind events
    $(document).keydown(function (e) {
        switch (e.which) {
        // x .
        case 88:
        case 190:
            controller.play(".pon");
            break;
        // a and '
        case 65:
        case 222:
            controller.play(".ka");
            break;
        // q
        case 81:
            var url = prompt("youtube url?");
            var vidId = url.match(/v=([^&]*)&?/)[1];
            yt_player.setBGM(vidId);
            break;
        // w
        case 87:
            var test = "p--p--p-p--p--p-p--p--p-k---k---p--p--p-p--p--p-k---k---p---k---k-k-ppp-k-k-pp \
                        p-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-pp \
                        p-p-p-kkk-ppp-k-kkkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp-k- \
                        k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-ppp-kkk-p-p-k-k-p--p--p- \
                        pppp---p---k--kpkp-k-k-p---k---p-p-k---p---k--kpkp-k-k-p---k---ppp-k---p---k-- \
                        kpkp-k-k-p---k---p-p-k---p---k--kpkp-k---p---p---k---k---k---k---p---p---p--pp \
                        k-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p---p-ppk-p-p---p-p-p- \
                        p---p-p---p---p---p-p-----------k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp- \
                        k-p-ppk-p-k---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p-p-p-p--- \
                        p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk-p-k----p-p-k-ppk-p-k \
                        -ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p-k-k-ppppppppp-ppppppppp-----p-p---- \
                        -----p-----p-p-----p-p---p-k-p-p-k-p-ppkkp-kkp-pp-pp-p-pp-pp-k-kk-kk-k-kk-kk-p \
                        -pp-pp-k-kk-kk-p-pp-pp-k-kk-kk-k-ppk-p-k-p-kkp-k-ppk-p-k-p-kkp-k-ppk-kkk-p-k-p \
                        -ppp---------------ppp-kkk-ppp-kkk-ppp-p-k-ppppppp-ppp-ppk-ppp-ppk-ppp-k-k-ppp \
                        pppp-p-k-ppk-p-k-ppk-p-k-ppk-ppppppp-p-k-ppk-kkp-ppk-k--k--k-ppppppp-k---k---p \
                        ---p---p-ppk-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p---p-ppk-p \
                        -p---p-p-p-p---p-p---p---p---p-p---------k-------------------------------k---- \
                        ---------------------------k---------------k---k---k---k---p-k-p-k-p---p-p-k-p \
                        pk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk-p-k---p-p-k-ppk-p-k-ppk-p-k \
                        kk-p-p-k---p-p-k-ppk-ppk-ppk---p-p-k-k-ppppppp-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p \
                        -k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-p-kkk-ppp-k-k \
                        kkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk \
                        -k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-kkk-p-p-k-k-p--p--p-p---p---k--k--p-p";
            $("#recordText").val(test.replace(/[^-kp]/g, ''));
            break;
        }
    });

    var clickType = ((null !== document.ontouchstart)? "click":"touchstart");
    $(".pon").bind(clickType, function () {controller.play(".pon");});
    $(".ka").bind(clickType, function () {controller.play(".ka");});

    $("#btn_record").bind("click", function () {
        player.stopRecordText();
        $("#recordText").val("");
        stat["player"] = setInterval(function () {
            player.logRecordText(stat["key"]);
        }, 100);
    });

    $("#btn_play").bind("click", function () {
        player.playRecordText(0);
    });

    $("#btn_stop").bind("click", function () {
        player.stopRecordText();
    });

    // set sample
    var patterns = [
        "p--p--k--ppp-p-k----p--p--k--ppp-p-k-kk",
        "p---k----pp-p--k----p---k----pp-p--k",
        "p---p---k-------p---p---k",
        "p--p--p-p--p--p-p--p--p-k---k"
    ];

    var pattern = patterns[Math.floor(Math.random() * patterns.length)];
    $("#recordText").val(pattern);

    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);

    $("#yt_video").hide();

    // if hash is given, extract ytid
    var str = window.location.hash.substr(1);
    var vidId = str.match(/v=([^&]*)&?/);
    if (vidId) {
        setTimeout(function() {
            yt_player.playBGM(vidId[1]);
        }, 1000);
    }

    var bpm = str.match(/b=([^&]*)&?/);
    if (bpm) {
        $("#tempo").val(parseInt(bpm[1]));
    }
    metronome.init(controller);
    console.log("metronome initialized.");

    // tempo stat
    metronome.statCallback = function (curr, len) {
        $("#tempo_stat").text(parseInt(curr / 4) + 1);
    }

});
