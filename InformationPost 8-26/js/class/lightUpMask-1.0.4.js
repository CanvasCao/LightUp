/*!
 * lightUpMask, a JavaScriptPlugIn v1.0.4
 * http://www.jimi.la/
 *
 * Copyright 2016, CaoYuhao
 * All rights reserved.
 * Date: 2016-8-26 15:19:14
 */

//1.0.4 遮罩层和瀑布分成两个对象
;
(function (w, d, $, undefined) {
    function LightUpMask(container, data) {
        this.C = this.container = (typeof container == 'string') ? $(container) : container;
        this.data = data;//data里有mask消失以后的hideCallback

        this.config = {
            imgW: 40
        };
        this.JM = this.jqueryMap = {};
        this.ifShow = false;
        this.init();
    }

    LightUpMask.prototype = {
        init: function () {
            this.initConfig();
            this.createDom();
            this.initCSS();
            this.bindEvent();
            this.createWaterfall();
        },
        initConfig: function () {

        },
        createDom: function () {
            var that = this;
            $(this.C).html("<div class='lightUpMaskBottom'></div>");
            $(this.C).find('.lightUpMaskBottom').append(" <div class='maskHeader'> <div class='maskClose'>关闭</div> </div>");

            //评论容器200 滚动条超过200重新加载ajax请求....................
            $(this.C).find('.lightUpMaskBottom')
                .append("<div class='maskSectionCon'>" +
                "<div class='maskSectionScroll'><div class='maskSectionCommentCon'></div></div>" +
                "</div>");

            $(this.C).find('.lightUpMaskBottom').append("<div class='maskInputBox'></div>");

            if (!GM.ifShare) {
                GM.jimiInputBox = new JimiInputBox($(that.C).find('.maskInputBox')[0], {
                    clickCallback: function (txt) {
                        GM.ajaxParas.content = txt;
                        controller.postLightUp(GM.ajaxParas, null);
                    },
                    uimg: searchJson.uimg,
                });
            }
        },
        initCSS: function () {
            var that = this;

            $(this.C).css({//mask就是后面的背景
                position: 'fixed',
                width: '100%',
                height: '100%',
                left: '0',
                top: '0',
                'background-color': 'rgba(0, 0, 0, 0.7)',
                display: 'none',
                'z-index': 2
                //opacity: '0',
            });

            $(this.C).find('.lightUpMaskBottom').css({
                position: 'absolute',
                width: '100%',
                'background-color': 'white',
                //bottom 0
            });


            $(this.C).find('.maskHeader').css({
                height: '40px',
                'background-color': 'white',
                'border-bottom': '1px solid #cccccc',
            })

            $(this.C).find('.maskClose').css({
                float: 'right',
                width: '50px',
                'margin-top': '12px',
                'font-size': '12px',
            })

            $(this.C).find('.maskSectionCon').css({
                'background-color': 'white',
                //不能加box-sizing 是因为height会算成198
                'box-sizing': 'border-box',
                height: 200,
                overflow: 'scroll'
            })

            $(this.C).find('.maskSectionScroll').css({})

        },
        bindEvent: function () {
            var that = this;

            $(this.C).click(function () {
                that.hide();
            })

            $(this.C).find('.maskClose').click(function () {
                that.hide();
            })

            //因为 冒泡的情况下点了mask会消失
            $(this.C).find('.lightUpMaskBottom').click(function (e) {
                e.stopPropagation();
            })

            //阻止评论出现时 mask的滚动
            this.C[0].addEventListener('touchmove', function (e) {
                //e.preventDefault();
                e.stopPropagation();
            }, false)


        },
        createWaterfall: function () {
            var that = this;
            GM.waterfall = new Waterfall({
                scrollCon: $(that.C).find('.maskSectionCon'),//滚动部分的容器
                scroll: $(that.C).find('.maskSectionScroll'),//滚动部分
                commentCon: $(that.C).find('.maskSectionCommentCon'),//评论的添加部分
            }, null);
        },

        show: function () {
            var that = this;
            this.ifShow = true;//showTag

            //real show
            setTimeout(function () {
                $(that.C).fadeIn('normal', 'swing');
                $(that.C).find('.lightUpMaskBottom')
                    .css({opacity: 0, bottom: -300})
                    .animate({opacity: 1, bottom: 0}, 'normal', 'swing', that.data.showCallback);
            }, 800);
        },

        //其实hide之后就可以 清空（clear）InputBox 但是点亮之前一定会clear 所以这里可以不做
        hide: function () {
            var that = this;
            this.ifShow = false;//showTag
            $(that.C).fadeOut('normal', 'swing');
            $(that.C).find('.lightUpMaskBottom').animate({
                opacity: 0,
                bottom: -300
            }, 'normal', 'swing', that.data.hideCallback);
        },

        //点亮成功 拉评论之前 clear
        clear: function () {
            //that.freshInputBox();
            var that = this;
            GM.waterfall.clear();
            if (GM.jimiInputBox) {
                GM.jimiInputBox.fresh();
            }

        },

    }

    w.LightUpMask = LightUpMask;
})(window, document, jQuery)


