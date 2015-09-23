$(document).ready(function () {

    // status register
    var stat = {
        '.pon': 0,
        '.ka': 0,
        'key': '-',
        'player': 0
    };

    // set animation delay by screen type (i think it's buggy)
    var isTouchable = (null === document.ontouchstart)? true:false;
    var delay = (isTouchable)? [20, 250, 100, 250]:[10, 80, 80, 200];

    // layout
    var animationWidth = $('#animation').width();
    var dimension = [animationWidth / 4, animationWidth * 3 / 16];

    // audio fx controller
    var controller = {
        play: function (id) {
            var el = this;
            this.sounds[id].play();
            stat['key'] = id[1];
            setTimeout(function () {
                stat['key'] = '-';
            }, 15000 / $('#tempo').val() + 1);
            if (0 !== stat[id]) {
                el.reset(id);
                setTimeout(function () {
                    $(id).removeClass('init').addClass('down').addClass('glowing');
                }, delay[0]);
                stat[id] = setTimeout(function () {
                    el.reset(id);
                }, delay[1]);
            } else {
                if (!isTouchable) {
                    $(id).removeClass('init').addClass('animate').addClass('glowing');
                    setTimeout(function () {
                        $(id).removeClass('animate').addClass('down').addClass('glowing');
                    }, delay[2]);
                } else {
                    $(id).removeClass('init').addClass('down').addClass('glowing');
                }
                stat[id] = setTimeout(function () {
                    el.reset(id);
                }, delay[3]);
            }
        },

        reset: function (id) {
            clearTimeout(stat[id]);
            $(id).removeClass('animate').removeClass('down').removeClass('glowing').addClass('init');
            stat[id] = 0;
        },

        // sounds
        sounds: {
            '.pon': new Howl({
                buffer: true,
                volume: 0.7,
                urls: audio_pon,
            }),
            '.ka': new Howl({
                buffer: true,
                volume: 0.7,
                urls: audio_ka,
            })
        }

    };

    // expermintal player
    var player = {
        logRecordText: function (key) {
            $('#record_text').val($('#record_text').val() + key);
        },

        playRecordText: function () {
            this.stopRecordText();
            metronome.tempo = parseInt($('#tempo').val());
            metronome.play($('#record_text').val());
        },

        stopRecordText: function (pos) {
            clearInterval(stat['player']);
            metronome.stop();
            $('#record_text').val(
                $('#record_text').val().replace(/[^-kp]/g, '').replace(/^-+/, '').replace(/-+$/, '')
            );
        }
    };

    // youtube player
    var yt_player = {
        playBGM: function (vidId) {
            this.player = new YT.Player('yt_video', {
                height: dimension[0] * 2,
                width: dimension[1] * 1.6,
                videoId: vidId,
                events: {
                    onReady: function(e) {
                        console.log('BGM playing');
                        e.target.playVideo();
                        if (undefined !== yt_player.callback) {
                            yt_player.callback();
                        }
                    },
                    onStateChange: function(e) {
                        if(e.data == YT.PlayerState.ENDED) {
                            console.log('BGM stopped');
                        }
                    }
                }
            });
            if ('none' !== $('.upper img.ka:first').css('display')) {
                $('#yt_video').width(dimension[0] * 2).height(dimension[1] * 1.6).show();
                $('.ka').addClass('small');
                $('.pon').addClass('small');
            } else {
                $('#yt_video').height(dimension[1] * 2.5).show();
            }
        },

        setBGM: function (vidId) {
            $('#yt_video').hide().replaceWith('<div id=\'yt_video\'></div>');
            this.playBGM(vidId);
        },

        stopBGM: function () {
            this.player.stopVideo();
        }
    }

    // bind events
    $(document).keydown(function (e) {
        switch (e.which) {
        // x .
        case 88:
        case 190:
            controller.play('.pon');
            break;
        // a and '
        case 65:
        case 222:
            controller.play('.ka');
            break;
        // q
        case 81:
            var url = prompt('youtube url?');
            var vidId = url.match(/v=([^&]*)&?/);
            if (vidId) {
                yt_player.setBGM(vidId[1]);
            }
            break;
        // w
        case 87:
            var test = 'p--p--p-p--p--p-p--p--p-k---k---p--p--p-p--p--p-k---k---p---k---k-k-ppp-k-k-p \
                        pp-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p- \
                        ppp-p-p-kkk-ppp-k-kkkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp \
                        -k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-ppp-kkk-p-p-k-k-p--p \
                        --p-pppp----p---k--kpkp-k-k-p---k---p-p-k---p---k--kpkp-k-k-p---k---ppp-k---p \
                        ---k--kpkp-k-k-p---k---p-p-k---p---k--kpkp-k---p---p---k---k---k---k---p---p- \
                        --p--ppk-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p---p-ppk-p-p \
                        ---p-p-p-p---p-p---p---p---p-p--------k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp- \
                        k-p-kkp-k-p-ppk-p-k---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p \
                        -p-p-p---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk-p-k----p-p \
                        -k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-k---k---k---k---p-p-k-k-ppppppp-p------p---- \
                        -p-p-------p-----p-p-----p-p---p-k-p-p-k-p-ppkkp-kkp-pp-pp-p-pp-pp-k-kk-kk-k- \
                        kk-kk-p-pp-pp-k-kk-kk-p-pp-pp-k-kk-kk-k-ppk-p-k-p-kkp-k-ppk-p-k-p-kkp-k-ppk-k \
                        kk-p-k-p-ppp-------------ppp-kkk-ppp-kkk-ppp-p-k-ppppppp-ppp-ppk-ppp-ppk-ppp- \
                        k-k-ppppppp-p-k-ppk-p-k-ppk-p-k-ppk-ppppppp-p-k-ppk-kkp-ppk-k--k--k-ppppppp-k \
                        ---k---p---p---p-ppk-p-p-------p---p---k---k---k-kkp-p-p-ppk---k---k---p---p- \
                        --p-ppk-p-p---p-p-p-p---p-p---p---p---p-p---------k-------------------------- \
                        -----k-------------------------------k---------------k---------------k---k--- \
                        k---k---p-k-p-k-p---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-p-kkp-k-p-kkp-k-p-ppk \
                        -p-k---p-p-k-ppk-p-k-ppk-p-kkk-p-p-k---p-p-k-ppk-ppk-ppk---p-p-k-k-ppppppp-k- \
                        k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp \
                        -k-k-ppp-p-ppp-p-p-kkk-ppp-k-kkkkk-kkk-k-k---p-p-k-k-ppp-k-k-ppp-k-k-ppp-p-pp \
                        p-p-k-k-ppp-k-k-ppp-p-k-k-k-kkk-k-k-k-k-ppp-k-k-ppp-k-k-ppp-p-ppp-p-ppp-kkk-p \
                        -p-k-k-p--p--p-p---p---k--k--p-p';
            $('#record_text').val(test.replace(/[^-kp]/g, ''));
            break;
        }
    });

    var clickType = ((isTouchable)? 'touchstart':'click');
    $('.pon').bind(clickType, function () {controller.play('.pon');});
    $('.ka').bind(clickType, function () {controller.play('.ka');});

    $('#btn_record').bind('click', function () {
        player.stopRecordText();
        $('#record_text').val('');
        stat['player'] = setInterval(function () {
            player.logRecordText(stat['key']);
        }, 15000 / $('#tempo').val());
    });

    $('#btn_play').bind('click', function () {
        player.playRecordText();
    });

    $('#btn_stop').bind('click', function () {
        player.stopRecordText();
        yt_player.stopBGM();
    });

    // set sample
    var patterns = [
        'p--p--k--ppp-p-k----p--p--k--ppp-p-k-kk',
        'p---k----pp-p--k----p---k----pp-p--k',
        'p---p---k-------p---p---k',
        'p--p--p-p--p--p-p--p--p-k---k'
    ];

    var pattern = patterns[Math.floor(Math.random() * patterns.length)];
    $('#record_text').val(pattern);

    setTimeout(function () {
        $('#fb_like iframe:first').attr('src', $('#fb_like iframe:first').data('src'));
    }, 1000);

    $('#yt_video').hide();

    // if hash is given, extract ytid
    var str = window.location.hash.substr(1);
    var vidId = str.match(/v=([^&]*)&?/);
    if (vidId) {
        setTimeout(function() {
            yt_player.setBGM(vidId[1]);
        }, 1000);
        if ('2L0nTAcDtGo' === vidId[1]) {
            $(document).trigger(jQuery.Event('keydown', { which: 87 }));
        }
    }

    var syncDelay = str.match(/d=([^&]*)&?/);
    if (syncDelay) {
        yt_player.callback = function () {
            setTimeout(function() {
                $('#btn_play').click();
            }, syncDelay[1]);
        }
    }

    var bpm = str.match(/b=([^&]*)&?/);
    if (bpm) {
        $('#tempo').val(parseInt(bpm[1]));
    }
    metronome.init(controller);
    console.log('metronome initialized.');

    // tempo stat
    metronome.statCallback = function (curr, len) {
        $('#tempo_stat').text(parseInt(curr / 4) + 1);
    }

});
