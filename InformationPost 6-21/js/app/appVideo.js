function app(ifShare) {

    //initCSS...............................................................
    //��Ƶ����
    $('#videoCon').css({width: $(window).width(), height: $(window).width() * 9 / 16});
    var winH = $(window).height();
    var vH = $('#videoCon').height();
    $('.scrollCon').css({height: (winH - vH)});



    //ajaxBindData..........................................................
    $.ajax({
        type: "get",
        url: jimiHost + '/informationPost.php' + window.location.search,
//            url: 'videoResource.json',
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpcallback",
        success: function (data) {
            console.log(JSON.stringify(data));
            $('body').animate({opacity: 1});

            //������....................
            $('#video').attr({'src': data.videoUrl});
            $('.read').html(data.read || 1);
            $('.star').html(data.star || 1);

            if (data.description) {
                $('.description').html(data.description);
            } else {
                $('.description').remove();
            }


            //���ٲ�������................................
            GM.waterfall = new Waterfall({
                scrollCon: $('.scrollCon'),//�������ֵ�����
                scroll: $('.scroll'),//��������
                commentCon: $('.commentCon'),//���۵���Ӳ���
            }, null);


            //���ص�һ������......................................
            GM.waterfall.JuHuaOn();
            controller.getLightUp(GM.ajaxParas, null);

        },
        error: function (err) {
            console.log('ERROR!');
            console.log(err);
        }
    });
}