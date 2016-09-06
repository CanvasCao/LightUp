/**
 * Created by Administrator on 2016/9/2.
 */
function appMarkCount() {



    //123..................
    $('.paragraph').each(function (i1, e1) {
        var para=i1;
        $(e1).find('.sentence').each(function(i2,e2){
            $(e2).addClass('init').find('.count').html('段落' + i1 + ' 句子'+i2).fadeIn();//显示吐槽数量

        })
    })


    $('.paragraphImg').each(function (i, e) {
        $(e).find('.count').html('段落' + i + ' type2').fadeIn();//显示吐槽数量
    })
    $('.paragraphWeb').each(function (i, e) {
        $(e).find('.count').html('段落' + i + ' type3').fadeIn();//显示吐槽数量
    })

    $('.count').css({width:130,color:'red',border:'1px solid red'});
}

