/*!
 * Waterfall, a JavaScriptPlugIn v1.0.0
 * http://www.jimi.la/
 *
 * Copyright 2016, CaoYuhao
 * All rights reserved.
 * Date: 2016-7-11 15:13:03
 */

//这个组件比较特殊 在瀑布流容器和瀑布流和评论框都已经存在的情况下 绑定事件用
;
(function (w, d, $, undefined) {
    function Waterfall(containerData, data) {
        //this.C = this.container = (typeof container == 'string') ? $(container) : container;
        this.C = this.container = {};
        this.C.scrollCon = containerData.scrollCon;//滚动部分的容器
        this.C.scroll = containerData.scroll;
        this.C.commentCon = containerData.commentCon;

        this.data = data;

        this.config = {
            perPage:5,
            imgW: 60,//单个评论的图片大小
        };
        this.JM = this.jqueryMap = {};
        this.ifNeedAjax = true;
        this.init();
    }

    Waterfall.prototype = {
        init: function () {
            this.initConfig();
            this.createDom();
            this.initCSS();
            this.bindEvent();
            this.bindWaterfallEvent();
        },
        initConfig: function () {

        },
        createDom: function () {
            var that = this;

        },
        initCSS: function () {
            var that = this;

        },
        bindEvent: function () {
            var that = this;

        },
        bindWaterfallEvent: function () {
            var that = this;

            $(that.C.scrollCon).scroll(function () {

                if (!that.ifNeedAjax) {
                    return;
                }

                var top = $(this).scrollTop();
                var conH = $(that.C.scrollCon).outerHeight();
                var scrollH = $(that.C.scroll).outerHeight();

                if (top >= (scrollH - conH)) { //动态高-容器高
                    that.JuHuaOn();
                    //controller.getLightUp(GM.ajaxParas, null);
                    $(that.C.commentCon).append('<div style="height: 100px" ></div>');
                    that.JuHuaOff();


                }
            })

        },

        prependContent: function (json) {
            var that = this;

            var userImgUrl = json.userImgUrl || 'img/logo.jpg';
            $(that.C).find('.maskSectionScroll').prepend(
                "<div class='maskSection'>" +
                "<div class='maskSectionImg'> <img src='" + userImgUrl + "' width='" + 40 + "' /> </div>" +
                "<div class='maskSectionContent'>" +
                "<div class='maskSectionUserName'>" + json.userName + "</div>" +
                "<div class='maskSectionCtime'>" + that.getJimiDateString() + "</div>" +
                "<div class='maskSectionComment'>" + json.content + "</div>" +
                "</div>");

            $(that.C).find('.maskSectionCon').scrollTop(0);
            that.initMaskSectionCSS();

        },
        appendContent: function (data) {
            var that = this;
            //appendDom................................................................
            if (data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    var userImgUrl = data[i].userImgUrl || 'img/logo.jpg';

                    $(that.C.commentCon).append(
                        "<div class='maskSection'>" +
                        "<div class='maskSectionImg'> <img src='" + userImgUrl + "' width='" + 40 + "' /> </div>" +
                        "<div class='maskSectionContent'>" +
                        "<div class='maskSectionUserName'>" + data[i].userName + "</div>" +
                        "<div class='maskSectionCtime'>" + data[i].ctime + "</div>" +
                        "<div class='maskSectionComment'>" + data[i].content + "</div>" +
                        "</div>");
                }

                that.initMaskSectionCSS();

                if (data.length < that.config.perPage) {
                    that.addFinishLoad();
                }
            }

        },

        initMaskSectionCSS: function () {
            var that = this;
            $(that.C.commentCon).find('.maskSection').css({
                'box-sizing': 'border-box',
                'padding-left': that.config.imgW,
                position: 'relative',
                'background-color': 'white',
                //'margin-bottom': '5px',
            })

            $(that.C.commentCon).find('.maskSectionImg').css({
                float: 'left',
                height: that.config.imgW,
                width: that.config.imgW,
                //border: '1px solid #000',
                'box-sizing': 'border-box',
                'padding': 10,
                position: 'absolute',
                top: '10px',
                left: '0',
            })

            $(that.C.commentCon).find('.maskSectionContent').css({
                width: '100%',
                padding: '10px 15px',
                'box-sizing': 'border-box',
            })


            $(that.C.commentCon).find('.maskSectionUserName').css({
                'font-size': '16px',
                color: '#058eff',
                //'margin-bottom': '5px',
            })


            $(that.C.commentCon).find('.maskSectionCtime').css({
                'font-size': '12px',
                color: '#747474',
                'margin-bottom': '5px',
            })


            $(that.C.commentCon).find('.maskSectionComment').css({
                'font-size': '12px',
            })

        },

        clear: function () {
            var that = this;
        },

        JuHuaOn: function () {
            var that = this;
            if (!$(that.C.scrollCon).find('#juhua').length) {
                $(that.C.commentCon).append("<div id='juhua' style='text-align: center;height: 100px;line-height: 100px'>正在加载...</div>")
            }
        },

        JuHuaOff: function () {
            var that = this;
            $(that.C.commentCon).find('#juhua').remove();
        },

        addNoData: function () {
            var that = this;
            if (!$(that.C.commentCon).find('#nodata').length) {
                $(that.C.commentCon).append("<div id='nodata' style='text-align: center;height: 200px;line-height: 200px'>暂无数据</div>");
            }
            that.ifNeedAjax = false;
        },
        addFinishLoad: function () {
            var that = this;
            if (!$(that.C.commentCon).find('#finishload').length) {
                $(that.C.commentCon).append("<div id='finishload' style='text-align: center;height: 50px;line-height: 50px'>加载完成</div>");
            }
            that.ifNeedAjax = false;
        },

        getJimiDateString: function () {
            //2016-05-25 11:07:27
            var date = new Date();
            var year = date.getFullYear();
            var mon = ((date.getMonth() + 1).toString().length == 1) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
            var day = (date.getDate().toString().length == 1) ? ('0' + date.getDate()) : date.getDate();
            var hour = (date.getHours().toString().length == 1) ? ('0' + date.getHours()) : date.getHours();
            var min = (date.getMinutes().toString().length == 1) ? ('0' + date.getMinutes()) : date.getMinutes();
            var sec = (date.getSeconds().toString().length == 1) ? ('0' + date.getSeconds()) : date.getSeconds();
            return (year + '-' + mon + '-' + day + ' ' + hour + ':' + min + ':' + sec);
        },
    }

    w.Waterfall = Waterfall;
})(window, document, jQuery)


