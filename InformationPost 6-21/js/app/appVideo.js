function app(ifShare) {

    //initCSS...............................................................
    //视频比例
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

            //绑定数据....................
            $('#video').attr({'src': data.videoUrl});
            $('.read').html(data.read || 1);
            $('.star').html(data.star || 1);

            if (data.description) {
                $('.description').html(data.description);
            } else {
                $('.description').remove();
            }


            //绑定瀑布流对象................................
            GM.waterfall = new Waterfall({
                scrollCon: $('.scrollCon'),//滚动部分的容器
                scroll: $('.scroll'),//滚动部分
                commentCon: $('.commentCon'),//评论的添加部分
            }, null);


            //加载第一次评论......................................
            GM.waterfall.JuHuaOn();
            controller.getLightUp(GM.ajaxParas, null);

        },
        error: function (err) {
            console.log('ERROR!');
            console.log(err);
        }
    });
}