/* JimiInputBox, a JavaScriptPlugIn v3.0.0
 * http://www.jimi.la/
 *
 * Copyright 2016, CaoYuhao
 * All rights reserved.
 * Date: 2016-8-24 16:37:34
 */


;
(function (w, d, $, undefined) {
    function JimiInputBox(container, data) {
        this.C = this.container = (typeof container == 'string') ? $(container) : container;//主页自己写容器
        this.data = data;
        this.uimg = data.uimg;
        this.clickCallback = data.clickCallback;

        this.config = {
            winW: $(window).width(),
            winH: $(window).height(),
        };
        this.JM = this.jqueryMap = {};

        //回复对象..................................
        this.state = null;//state有add和reply两种 现在不需要了 因为placeholder代替了这个属性...................'
        this.resetReplyInfo();


        //初始化....................................
        this.init();
    }

    JimiInputBox.prototype = {
        init: function () {
            this.initConfig();
            this.createDom();
            this.initCSS();
            this.bindEvent();
        },
        initConfig: function () {

        },
        createDom: function () {
            var that = this;
            //$(this.C).html('<div class="jimiInputBoxImg"></div>');
            $(this.C).html('<div class="jimiInputBoxText"></div>');

            $(this.C).find('.jimiInputBoxImg').html('<img /></div>')
            $(this.C).find('.jimiInputBoxText').html(' <input type="text" maxlength="40"/>' +
                '<div class="jimiInputBoxSubmit">微评</div>');

        },
        initCSS: function () {
            var that = this;

            $(this.C).css({
                height: '50px',
                'box-sizing': 'border-box',
                padding: '10px 10px 5px 15px',
                'background-color': 'white',
                'font-size': '16px',
                'border-top': '1px solid rgb(204, 204, 204)'
            });

            $(this.C).find('.jimiInputBoxImg').css({
                position: 'absolute',
                top: '5px',
                left: '0',
                width: '40px',
                height: '40px',
                /*border: 1px solid #000;*/
                'box-sizing': 'border-box',
                padding: '5px',
            })

            $(this.C).find('.jimiInputBoxImg img')
                .attr({src: that.uimg})
                .css({
                    width: '30px',
                    height: '30px',
                    'border-radius': '50%',
                })

            $(this.C).find('.jimiInputBoxText').css({
                'box-sizing': 'border-box',
                'border-radius': '20px',
                width: '100%',
                height: '30px',
                'background-color': '#eee',
                position: 'relative',
            })


            $(this.C).find('.jimiInputBoxText input').css({
                'background-color': '#eee',
                color: 'gray',
                height: '30px',
                'margin-left': '15px',
                width: '80%'
            })


            $(this.C).find('.jimiInputBoxSubmit').css({
                position: 'absolute',
                right: '10px',
                top: '5px',
                'border-radius': '30px',
                'font-size': '12px',
                'box-sizing': 'border-box',
                padding: '2px 6px',
                color: 'white',
                'background-color': '#3982e1',
            })

        },
        bindEvent: function () {
            var that = this;


            //input的focus和blur事件
            $(this.C).find('input').focus(function () {
            }).blur(function () {
            });

            //oninput事件 只在w3c浏览器触发 在state是回复的情况下启动 只要内容就显示 没有就显示回复了谁
            $(this.C).find('input')[0].addEventListener('input', function () {
            }, false);

            //发送按钮的事件
            $(this.C).find('.jimiInputBoxSubmit').click(function () {
                var txt = $(that.C).find('input').val().trim();
                if (txt == '') {
                    return;
                }
                else {

                    if (this.btnDisable == true) {
                        return;
                    }
                    else {
                        that.btnDisabled();
                        setTimeout(function () {
                            that.btnAbled();
                        }, 2000);


                        //该组件的初始化参数 在lightUpMask.js传入的初始化参数 点击以后执行的方法 和 用户头像
                        that.clickCallback(txt);

                        $(that.C).find('input').val('');
                    }
                }

            });
        },

        //fresh 暴露给外部 调用重置reply对象方法
        fresh: function () {
            var that = this;

            //刷新的时候 说明回复过了 清空一下被回复人
            that.resetReplyInfo();

        },


        //只是用来点击以后 切换颜色
        btnDisabled: function () {
            var that = this;

            $(that.C).find('.jimiInputBoxSubmit').css('background', 'gray');
            that.btnDisable = true;
        },
        btnAbled: function () {
            var that = this;

            $(that.C).find('.jimiInputBoxSubmit').css('background', '#3982e1');
            that.btnDisable = false;
        },


        setReplyInfo: function () {
            var that = this;

            $(this.C).find('input')
                .attr({placeholder: '回复 ' + GM.ajaxParas.replyUname + ' 的评论:'}).focus();

        },
        resetReplyInfo: function () {
            GM.ajaxParas.replyUname = null;
            GM.ajaxParas.replyUid = null;
            GM.ajaxParas.lid = null;//其实是replyId

            $(this.C).find('input')
                .removeAttr('placeholder');
        },
    }

    w.JimiInputBox = JimiInputBox;
})(window, document, jQuery)


