/**
 * Created by Administrator on 2016/6/17.
 */
(function (w, d, $, undefined) {
    var controller = {};

    controller.postLightUp = function (data, callback) {
        console.log(JSON.stringify(data));
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
                    userImgUrl: searchJson.uimg,
                    userName: searchJson.uname,
                    content: GM.ajaxParas.content,
                });

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
            //url: 'videoComment.json',
            data: data,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "jsonpcallback",
            success: function (data) {
                console.log(JSON.stringify(data));

                var waterfall = GM.waterfall;
                GM.waterfall.JuHuaOff();

                if (data.data.length == 0) {
                    if (GM.ajaxParas.curPage == 1) {
                        waterfall.addNoData();
                        return;
                    }
                    if (GM.ajaxParas.curPage > 1) {
                        waterfall.addFinishLoad();
                        return;
                    }
                }
                else {
                    waterfall.appendContent(data.data);
                    GM.ajaxParas.curPage++;
                }


            },
            error: function (err) {
                console.log('ERROR!');
                console.log(err);

                var waterfall = GM.waterfall;
                waterfall.JuHuaOff();
                waterfall.addFinishLoad();

            }
        });
    }


    w.controller = controller;
})(window, document, $)
