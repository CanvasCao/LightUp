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
            perPage: 5,
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
            //dom已经存在..................
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
                    controller.getLightUp(GM.ajaxParas, null);
                    that.JuHuaOff();

                }
            })

        },
        //返回一个评论单元....................................................................
        getMaskSectionStr: function (json) {
            var lightUpId = json.lightUpId;
            var userId = json.userId;


            //点击回复按钮....................................................................
            var replyDomStr = '';
            if (GM.ifShare) {
                replyDomStr = '';
            } else {
                //点击会知道当前用户的主键 告诉服务器 哪条评论被回复 的主键和uid 记录uname是因为 点击回复需要显示回复了谁
                replyDomStr = (userId == searchJson.uid) ? "" : "<div class=maskSectionReply data-bindclick=false data-lid=" + lightUpId + " data-uid=" + userId + " data-uname=" + json.userName + " ><img src='img/reply.png' class='maskSectionReplyImg' />回复</div>";
            }

            var content = json.content;
            if (json.replyUname) {
                //说明是回复的...........................................
                content = '回复' + '<span style="color:#058eff"> ' + json.replyUname + ' </span>: ' + content;
            }

            var maskSectionStr = "<div class='maskSection'>" +
                "<div class='maskSectionImg'> <img src='" + json.imgUrl + "' width=40 /> </div>" +
                "<div class='maskSectionContent'>" +
                "<div class='maskSectionUserName'>" + json.userName + replyDomStr + "</div>" +
                "<div class='maskSectionCtime'>" + json.dateStr + "</div>" +
                "<div class='maskSectionComment'>" + content + "</div>" +
                "</div>" +
                "</div>";
            return maskSectionStr;
        },
        //服务器返回了我新插入的记录主键 data.id
        prependContent: function (json) {
            var that = this;

            var userImgUrl = searchJson.uimg || 'img/logo.jpg';
            var maskSectionStr = that.getMaskSectionStr({
                imgUrl: userImgUrl,
                userName: searchJson.uname,
                dateStr: that.getJimiDateString(),
                content: GM.ajaxParas.content,//content 变量在inputBox点击的时候修改 点击事件在LightUpMask的新建inputBox定义
                userId: searchJson.uid,
                lightUpId: json.lightUpId,//这条insert记录 主键在调插入接口以后会返回
                replyUname: GM.ajaxParas.replyUname,
            });


            $(that.C.commentCon).prepend(maskSectionStr);

            that.toTop();

            that.initMaskSectionCSS();
            that.bindMaskSectionEvent();

        },

        appendContent: function (data) {
            var that = this;
            //appendDom................................................................
            if (data.length > 0) {
                for (i = 0; i < data.length; i++) {
                    var curData = data[i];//一个curData 就是 一条评论记录
                    var userImgUrl = curData.userImgUrl || 'img/logo.jpg';

                    var maskSectionStr = that.getMaskSectionStr({
                        imgUrl: userImgUrl,
                        userName: curData.userName,
                        dateStr: curData.ctime,
                        content: curData.content,
                        userId: curData.uid,
                        lightUpId: curData.lid,
                        replyUname: curData.replyUname,
                    });

                    $(that.C.commentCon).append(maskSectionStr);
                }

                that.initMaskSectionCSS();
                that.bindMaskSectionEvent();

                if (data.length < 3) {
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
            }).find('.maskSectionReplyImg').css({
                display: 'inline',
                width: 15,
                margin: '0 8px 0 0',
            }).end().find('.maskSectionReply').css({
                display: 'inline',
                'font-size': '12px',
                color: '#747474',
                float: 'right',
            })

            $(that.C.commentCon).find('.maskSectionCtime').css({
                'font-size': '12px',
                color: '#747474',
                'margin-bottom': '5px',
            })


            $(that.C.commentCon).find('.maskSectionComment').css({
                'font-size': '12px',
                'word-break': 'break-word',
            })

        },
        bindMaskSectionEvent: function () {
            var that = this;

            //遍历maskSectionReply 如果绑定过事件则不再绑定 否则事件会叠加
            $(that.C.commentCon).find('.maskSectionReply').each(function (i, e) {
                var ifBindclick = $(e).attr('data-bindclick');

                if (ifBindclick == 'false') {
                    $(e).attr('data-bindclick', 'true');
                    $(e).click(function () {

                        //设置回复对象 一旦设置 接口会认为这条是回复 但是app.js点亮之前会调用mask.clear()  clear中间又会调用fresh()....................
                        var uid = $(e).attr('data-uid');
                        var lid = $(e).attr('data-lid');
                        var uname = $(e).attr('data-uname');
                        GM.ajaxParas.replyUname = uname;
                        GM.ajaxParas.replyUid = uid;
                        GM.ajaxParas.lid = lid;//其实是replyId
                        GM.jimiInputBox.setReplyInfo();

                    })
                }
            })

        },
        clear: function () {
            var that = this;
        },

        toTop: function () {
            var that = this;
            $(that.C.scrollCon).scrollTop(0);

        },

        JuHuaOn: function () {
            var that = this;
            if (!$(that.C.commentCon).find('#juhua').length) {
                $(that.C.commentCon).append("<div id='juhua' style='text-align: center;height: 100px;line-height: 100px;padding-bottom: 50px;'>正在加载...</div>")
            }
        },

        JuHuaOff: function () {
            var that = this;
            $(that.C.commentCon).find('#juhua').remove();
        },

        addNoData: function () {
            var that = this;
            if (!$(that.C.commentCon).find('#nodata').length) {
                $(that.C.commentCon).append("<div id='nodata'>" +
                    '<img src="img/nodata.jpg" />' +
                    "<div>快来评论吧...</div>" +
                    "</div>");
                $(that.C.commentCon).find('#nodata').css({
                    'text-align': 'center',
                    'padding-bottom': 50,
                }).find('img').css({
                    display: 'block',
                    margin:'50px auto'
                })

            }
            that.ifNeedAjax = false;
        },
        addFinishLoad: function () {
            var that = this;
            if (!$(that.C.commentCon).find('#finishload').length) {
                $(that.C.commentCon).append("<div id='finishload' style='text-align: center;height: 50px;line-height: 50px;padding-bottom: 50px;'>加载完成</div>");
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


