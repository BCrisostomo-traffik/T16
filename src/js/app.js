$(document).ready(function () {

    $delay = 200;

    function heightDetect() {
        $(".head-block").css("height", $(window).height() - 70);
        $(".video-wrap").css("width", $(window).width() - 70);
        //  $(".inline-video").css("width",'614px')
        $(".play-but-wrap").css("height", $(window).height() - 70);
    };
    heightDetect();
    $(window).resize(function () {
        heightDetect();
    });


    if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Mac') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
        $('body').addClass('safari-mac');
    }


    $(".menu-trigger").click(function () {
        $(".sidebar-menu").toggleClass("sidebar-menu-active");
    });

    $(".close-menu").click(function () {
        $(".sidebar-menu").removeClass("sidebar-menu-active");
    });

    $(".work-video").click(function () {
        var videoID = $(this).find('video').attr('id');
        var video = document.getElementById(videoID);
        if ($(this).hasClass('playing')) {
            $(this).removeClass('playing');
            video.pause();
        } else {
            $(this).addClass('playing');
            video.play();
        }


    });

    $(function () {
        $('.set-del-gr3').matchHeight({
            byRow: false,
            property: 'height',
            target: null,
            remove: false
        });
    });

    $(function () {
        $('.set-del-gr3').matchHeight({
            byRow: false,
            property: 'height',
            target: null,
            remove: false
        });
    });


    $(".scroll-trigger").mPageScroll2id();

    $('.anim-item1').viewportChecker({
        classToAdd: 'appeared-item1',
        offset: ($(window).height() * .2),
    });

    $('.anim-item2').viewportChecker({
        classToAdd: 'appeared-item2',
        offset: ($(window).height() * .2),
    });

    $('.anim-item3').viewportChecker({
        classToAdd: 'appeared-item3',
        offset: ($(window).height() * .2),
    });

    $('.lines-block-wrap').viewportChecker({
        classToAdd: 'lines-block-wrap-anim',
        offset: ($(window).height() * .1),
    });

    $('#diagram').viewportChecker({
        classToAdd: 'diagram-active',
        offset: ($(window).height() * .2),
    });

    $('.red-line-vert').viewportChecker({
        classToAdd: 'red-line-vert-vis',
        offset: ($(window).height() * .2),
    });

    $('.contact-region-line').viewportChecker({
        classToAdd: 'contact-region-line-vis',
        offset: ($(window).height() * .2),
    });

    $('.marks-img-anim').viewportChecker({
        classToAdd: 'marks-img-appeared',
        offset: ($(window).height() * .2),
    });

    $('.inline-video').viewportChecker({
        classToAdd: 'play',
        offset: ($(window).height() * .2),
        callbackFunction: function (elem, action) {
            $('.inline-video .video-block').css("opacity", 1);
            var videoID = $(elem).find('video').attr('id');
            var video = document.getElementById(videoID);
            video.play();
        }
    });

    $('.service-icons').viewportChecker({
        classToAdd: 'appeared-item3',
        offset: ($(window).height() * .2),
        callbackFunction: function () {

            $.each($('.service-icons').find('img'), function () {
                $delay = $delay + 1000;
                setTimeout(function () {
                    $delay = $delay + 1000;
                    $(this).attr("src", $(this).attr("src") + '?v=' + $.now());
                }, $delay);
            });
            animateIn();

        }
    });

    function animateIn() {
        $d = 300;
        $.each($('.service-icons').find('img'), function () {
            setTimeout(function () {
                $d = $d + 400;
                $('.service-icons img').css("display", "block");
            }, $d);
        });
    };
    function accordionBlock() {
        $('li > .accord-toggle').unbind('click').click(function () {
            if (!$(this).hasClass('active-accord')) {
                $('li > .accord-toggle').removeClass(
                    'active-accord').next('ul').slideUp();
                $(this).addClass('active-accord');
                $(this).next('ul').slideDown();
            } else {
                $(this).removeClass('active-accord').next('ul')
                    .slideUp();
            }
        });
    };
    accordionBlock();


});
