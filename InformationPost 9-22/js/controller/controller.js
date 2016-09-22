/**
 * Created by Administrator on 2016/6/17.
 */
(function (w, d, $, undefined) {
    var controller = {};

    controller.ifAjaxing = false;

    controller.postLightUp = function (data, callback) {
        $.ajax({
            type: "post",
            url: jimiHost + '/postLightUp.php',
//                url: 'package.json',
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpcallback",
            success: function (data) {
                console.log('Success!')
                console.log(JSON.stringify(data));

                GM.waterfall.prependContent({
                    lightUpId: data.id,
                })
                GM.jimiInputBox.fresh(); //输入框重置代表删除 回复信息对象
                GM.updateCount();
            },
            error: function (err) {
                console.log('ERROR!')
                console.log(err);
            }
        });
    };

    controller.getLightUp = function (data, callback) {
        console.log(JSON.stringify(data));
        $.ajax({
            type: "post",
            url: jimiHost + '/getLightUp.php',
            //url: 'content.json',
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpcallback",
            success: function (data) {
                console.log(JSON.stringify(data));

                GM.waterfall.JuHuaOff();

                //console.log(that.ajaxGetData);
                if (data.data.length == 0) {
                    if (GM.ajaxParas.curPage == 1) {
                        GM.waterfall.addNoData();
                        return;
                    }
                    if (GM.ajaxParas.curPage > 1) {
                        GM.waterfall.addFinishLoad();
                        return;
                    }
                }
                else {
                    GM.waterfall.appendContent(data.data);
                    GM.ajaxParas.curPage++;
                }
            },
            error: function (err) {
                console.log('ERROR!');
                console.log(err);
            }
        });
    }


    w.controller = controller;
})(window, document, $)
