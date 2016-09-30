function app() {

    //init 头部图片起始位置................................................................
    $('#con').css({width: $(window).width(), height: $(window).height()})
    $('.titleImg').css({height: 400});


    //jqObj............................................................................
    var $txtContainer = $('.txtContainer');
    var $light = $('.light');

    //mask对象
    globalManager.lightUpMask = new LightUpMask('.lightUpMask', {
        hideCallback: function () {
            RemoveClass();
            $light.css({display: 'block'}).velocity({opacity: 1}, 'fast', 'swing', function () {
            });
        },
        showCallback: function () {
            $light.velocity({opacity: 0}, 'fast', 'swing', function () {
                $light.css({display: 'none'});
            });
        }
    });


    //点亮标签相关 全局变量...................................................................................
    var lightUpLock = false;
    var ifDragging = false;
    var ifMoved = false;
    var mouseDown = {x: 0, y: 0};
    var mouseCurrent = {x: 0, y: 0};
    var timer = null; //setTimeOut的定时器
    var lightState = {
        touchStart: {
            'box-shadow': '0 0px 0px 15px rgba(70,170,255,0.2)',
        },
        touchMove: {
            transition: 'all 0s ease',
            'pointer-events': 'none'
        },
        touchEnd: {
            transition: 'all 0.7s ease-in-out',
            transform: 'translate3d(0px,0px,0px)',
            'pointer-events': 'auto',
            'box-shadow': '0 2px 4px 1px rgba(0, 0, 0, 0.8)',
        }
    }


    $('.light')[0].addEventListener('touchstart', function (e) {
        if (globalManager.lightUpMask.ifShow) {
            e.preventDefault();
            return;
        }

        var touch = e.touches[0];
        mouseDown.x = touch.clientX;
        mouseDown.y = touch.clientY;
        ifDragging = true;
        $light.css(lightState.touchStart);

    }, false)

    window.addEventListener('touchmove', function (e) {
        //light不能拖动
        if (globalManager.lightUpMask.ifShow) {
            e.preventDefault();
            return;
        }

        if (ifDragging) {
            e.preventDefault();

            if (lightUpLock) {
                return;
            }
            else {
                ifMoved = true;//标记移动
                var touch = e.touches[0];
                mouseCurrent.x = touch.clientX;
                mouseCurrent.y = touch.clientY;
                lightState.touchMove.transform = 'translate3d(' + (mouseCurrent.x - mouseDown.x) + 'px,' + (mouseCurrent.y - mouseDown.y) + 'px,0px)';
                $light.css(lightState.touchMove);


                LightUp();
                lightUpLock = true;
                timer = setTimeout(function () {
                    lightUpLock = false;
                }, 20);
            }

        }
    }, false)

    window.addEventListener('touchend', function (e) {
        //e.preventDefault();
        if (ifDragging && ifMoved) {
            lightUpLock = false;

            if (LightUp()) {
                ResetAjaxParas();
                GM.ajaxParas.curPage = 1; //点亮成功一定是请求第一页

                GM.lightUpMask.clear();
                GM.lightUpMask.show();
                controller.getLightUp(GM.ajaxParas, null);
            }
            ifDragging = false;
            ifMoved = false;
            $light.css(lightState.touchEnd);
        }
    }, false)


    function RemoveClass() {
        var ele = GM.lastElement;
        var type = GM.lastElementType;

        if (type == 1) {
            $(ele).closest('.sentence').removeClass('active');
        } else if (type == 2) {
            $(ele).parent('.paragraphImg').removeClass('active');
        }
    }

    function AddClass() {
        var type = GM.elementType;
        if (type == 1) {
            $(GM.element).closest('.sentence').addClass('active');
        } else if (type == 2) {
            $(GM.element).parent('.paragraphImg').addClass('active');
        }
    }


    function GetTypeFromElement() {
        var ele = GM.element;
        if ($(ele).closest('.sentence').length) {
            return 1;
        }
        else if ($(ele).closest('.paragraphImg').length) {
            return 2;
        } else {
            return null;
        }
    }

    //UI层点亮函数 返回布尔是否点亮成功 刷新全局ele和eleType
    function LightUp() {
        GM.lastElementType = GM.elementType || null;
        GM.lastElement = GM.element || null;
        GM.element = document.elementFromPoint(mouseCurrent.x, mouseCurrent.y);
        GM.elementType = GetTypeFromElement();
        RemoveClass();
        if (GM.elementType != null) {
            AddClass();
            return true;
        }
        return false;
    };

    //重新设置全局的ajax参数 此时element改了 所以全局ajax参数也改了
    function ResetAjaxParas() {
        if (GM.elementType == 1) { //判断当前是类图片还是文字
            var paragraph = $(GM.element).closest('.paragraph').index('.paragraph');
            var sentence;

            var $sentence = $(GM.element).closest('.sentence');
            var $parent = $(GM.element).closest('.sentence').parent();
            var $sens = $parent.find('.sentence');
            for (i = 0; i < $sens.length; i++) {
                if ($sentence[0] == $sens.eq(i)[0]) {
                    sentence = i;
                    break;
                }
            }

            GM.ajaxParas.type = GM.elementType;
            GM.ajaxParas.paragraph = paragraph;
            GM.ajaxParas.sentence = sentence;

        }
        else if (GM.elementType == 2) {
            var paragraph = $(GM.element).closest('.paragraphImg').index('.paragraphImg');
            GM.ajaxParas.type = GM.elementType;
            GM.ajaxParas.paragraph = paragraph;
        }
        else if (GM.elementType == 3) {
            var paragraph = $(GM.element).closest('.paragraphWeb').index('.paragraphWeb');
            GM.ajaxParas.type = GM.elementType;
            GM.ajaxParas.paragraph = paragraph;

        }
    }

    //count类名 相关的方法
    function addCount(eleType, paragraph, sentence, count) {
        if (count == 0) { //0吐槽的时候就会不显示
            return;
        }

        var $ele = null;
//                    count前面的元素加addClass init类名
        if (eleType == 1) {
            $ele = GM.jQueryMap.$paragraphs.eq(paragraph).find('.sentence').eq(sentence);
        } else if (eleType == 2) {
            $ele = GM.jQueryMap.$paragraphImgs.eq(paragraph);
        }
        else {
            return;
        }
        $ele.addClass('init').find('.count').html(count + '吐槽').fadeIn();//显示吐槽数量
    }

    function updateCount() {
        var $ele = null;
        var para = GM.ajaxParas;
//                    count前面的元素加addClass init类名
        if (para.type == 1) {
            $ele = GM.jQueryMap.$paragraphs.eq(para.paragraph).find('.sentence').eq(para.sentence);
        } else if (para.type == 2) {
            $ele = GM.jQueryMap.$paragraphImgs.eq(para.paragraph);
        }

        var count = parseInt($ele.find('.count').html()) || 0;
        $ele.addClass('init').find('.count').html(count + 1 + '吐槽').fadeIn();//显示吐槽数量
    }

    GM.updateCount = updateCount; //暴露给inputBox输入完以后更新用了


    //这里的ajax只是为了绑定起始数据..........................................................................


    console.log(jimiHost + '/informationPost.php' + window.location.search);
    $.ajax({
        type: "get",
        url: jimiHost + '/informationPost.php' + window.location.search,
//            url: 'r.json',
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "jsonpcallback",
        success: function (data) {

            $('#loading').hide();
            $('#loaded').show();
            console.log(JSON.stringify(data));

            //title......................................................................
            $('.titleImg').attr('src', data.titleImgUrl);
            $('.titleTextTop').html(data.title);
            $('.titleTextRead').html(data.read || 1);
            $('.titleTextStar').html(data.star || 1);


            //source IOS不加.................................................................
            $('.sourceCon div').eq(0).html('文章来自: ' + '<span style="color: #3982e1">' + data.articleSource + '</span>');
            $('.sourceCon div').eq(1).html(data.atricleDateString || new Date().toLocaleDateString());


            //txtContainer容器 绑定数据
            var text = data.content;
            $txtContainer.html(text);
            labelAdapter($txtContainer);//适配标签...........................................................


            if (GM.ifMarkCount) {
                appMarkCount()
            } else {
                //这里代表数据绑定完可以显示有点亮的数据
                if (data.lightUpData) {
                    initCss(data.lightUpData);
                    function initCss(lightUpData) {
//                                    console.log(JSON.stringify(lightUpData));
                        if (!lightUpData) {
                            return;
                        }
                        ;
                        [].forEach.call(lightUpData, function (e, i, arr) {
                            addCount(e.type, e.paragraph, e.sentence, e.count);
                        });
                    }
                }

                //点亮的count被点击的时候..............
                $(window).click(function(e){
                    var target= e.target;
                    var $target=$(target);
                    if($target.closest('.count').length>0){
                        GM.element =target;
                        GM.elementType = GetTypeFromElement(GM.element);
                        ResetAjaxParas();
                        GM.ajaxParas.curPage = 1; //点亮成功一定是请求第一页
                        GM.lightUpMask.clear();
                        GM.lightUpMask.show();
                        controller.getLightUp(GM.ajaxParas, null);
                    }


                })
            }
        },
        error: function (err) {
            console.log('ERROR!');
            console.log(err);
        }
    });
}