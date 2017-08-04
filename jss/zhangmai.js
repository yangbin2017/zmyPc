function ajax_get(ajax_type,url,$obj){

    $.ajax({type: ajax_type,dataType: 'json', url: url, success: function(json){

        if(!$obj.attr('modal-show')){
            $('.modal').modal('hide');
        }
        var item = json.item;
        if(json.status == 1){
            check_logout(json);//登录超时检验
            var reload_url = '';
            var obj_modal = $obj.closest('.modal');
            if(obj_modal.attr('class')){
                reload_url = obj_modal.find('#url').text();
                if(!reload_url){
                    reload_url = $('#ajax-page #url').text();
                }

            }else{
                reload_url = $('#ajax-page #url').text();
            }
            if(item.msg){
            	swal({
                    title: item.msg ? item.msg : '操作成功',
                    text: false,
                    type: "success",
                    timer:1000
                }, function () {
                	sweetAlert.close();
                    if($obj.attr('data-parent')){
                        $obj.closest($obj.attr('data-parent')).remove();
                        refreshTableindex();
                    }else{
                        if (item.url) {
                            //window.location.href = item.url;

                        }else{
                            if(reload_url){
                                var load_area = $obj.attr('data-reload') ? $obj.attr('data-reload') : '#shangpingzhanshi';
                                $(this).zm_ajax({content_area : load_area,content_url: reload_url,loading_html:''});
                                if($('.floatthead').attr('class')){
                                    resetheadwidthx();
                                }
                            }else{
                                if(json.item.mark == 2 && json.item.data.html){
                                    var data = item.data;
                                    $('#tr_' + data.id).css('background-color','#FFF6E5');
                                    $('#tr_'+data.id).html(data.html);

                                }else{
                                    window.location.reload();
                                }
                            }
                        }
                    }

                });
            }else{

                sweetAlert.close();
                if($obj.attr('data-parent')){
                    $obj.closest($obj.attr('data-parent')).remove();
                    refreshTableindex();
                }else{
                    if (item.url) {
                        window.location.href = item.url;
                    }else{
                        if(json.item.mark == 3){
                            window.location.reload();
                        }else if(json.item.mark == 4){
                            $obj.closest('tr').remove();
                        }else{
                            if(reload_url.length > 0){
                                var load_area = $obj.attr('data-reload') ? $obj.attr('data-reload') : '#shangpingzhanshi';
                                $(this).zm_ajax({content_area : load_area,content_url: reload_url,loading_html:''});
                                if($('.floatthead').attr('class')){
                                    resetheadwidthx();
                                }
                            }else{
                                window.location.reload();
                            }
                        }

                    }
                }

            }
        }else{
            swal(item.msg ? item.msg : '系统繁忙，请稍后再试', false, "warning",1500);
        }
    },error: function(){
        swal('系统繁忙，请稍后再试', false, "warning");
    }});
}
//列表序号刷新
function refreshTableindex(){
    var cur_page = parseInt($('tbody').attr('data-page'));
    if(!cur_page){
        cur_page = 0;
    }

    if($('tbody tr').find("td:first").length > 0){
        var j = 0;
        $.each($('tbody tr').find("td:first"),function(){
            j++;
            var i = $(this).closest("tr").index();
            if(j != $('tbody tr').find("td:first").length ){
                $(this).html(i+1+cur_page);
            }

        });
    }
}
/**
 * 图片上传
 * @returns
 */
function uploadPic(url,obj){
    $.ajaxFileUpload ({
        url: url,
        secureuri:false,
        fileElementId:'image',
        dataType: 'JSON',
        success: function (data, status, e)
        {

        	data = eval('(' + data + ')');
            if(data.status == 1){
                var json = data;
                check_logout(json);//登录超时检验
                $('#' + obj).val(data.item.data.img);
                $('#' + obj + '_view').attr("src",data.item.data.imgurl);
            }else{
                swal(data.item.msg, false, "warning",1500);
            }
        },
        error: function (data, status, e)//服务器响应失败处理函数
        {
            swal('系统繁忙，请稍后再试', false, "warning",1500);
        }
    });
}
$(document).ready(function () {
    //分页跳转
    $('body').on('keyup','#ajax-page .page-input',function(evt){
        var page_num = $(this).val();
        var ajax_page = $(this).closest('#ajax-page');
        if(page_num > 0){
            var new_href = ajax_page.find('.btn-page').attr('data-url')+'&page='+page_num;
            ajax_page.find('.btn-page').attr('href',new_href);
            var keyCode = evt.which;
            if(keyCode == 13){
                ajax_page.find('.btn-page').click();
                return false;
            }
        }
    });
    /**ajax提交事件**/
    $('body').on('click','.btn-ajax',function(){
        var msg = $(this).attr('data-msg') ? $(this).attr('data-msg') : '确定要进行该操作吗？';
        var url = $(this).attr('data-url');
        var no_confirm = $(this).hasClass('no-confirm');
        var ajax_type = $(this).attr('data-ajax') == 'POST' ? 'POST' : 'GET';
        ajax_type = 'POST' ? 'POST' : 'GET';
        var $this = $(this);
        if(no_confirm){
            ajax_get(ajax_type,url,$this);
        }else{
            swal({
                title: msg,
                text: false,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff6e6e",
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function () {
                ajax_get(ajax_type,url,$this);
            });
        }
        return false;
    });
    
    /**自定义js编辑区域开始**/
    validationForm($('.validation'));//全局表单验证
	$('.chosen-select').chosen({disable_search:true}); //select框插件
    $('.modal').on('show.bs.modal',function(){ //全局modal验证
        validationForm($(this).find('.validation'));
		$('.chosen-select').chosen({width:'100%',disable_search:true}); //select框插件
    });
    /**超市切换**/
    $('body').on('click','.btn-switch',function(){
        var $overlay = $('<div id="loadinggif"></div>');
        $("body").append($overlay);
        var url = $(this).attr('data-url');
        var shop_id =$(this).attr('data-shop-id');
        $.ajax({type: 'GET',dataType: 'json', url: url, success: function(json){
            $overlay.remove();
            var item = json.item;
            if(json.status == 1){
                check_logout(json);//登录超时检验
                if (item.url) {
                    window.location.href = item.url;
                }else{
                    var hash = $.trim(window.location.hash);
                    var url_hash_index = hash.indexOf('?');
                    if(url_hash_index > 0){
                        hash = hash.substr(0,url_hash_index);
                    }

                    var load_url = '';
                    /*if(hash == '#goods/stock' && url_hash_index > 0){
                        load_url = '#goods/stock';
                    }else if(hash == '#goods/transfer_detail'){
                        load_url = '#goods/price?nav_type=transfer';
                    }else if(hash == '#goods/return_detail'){
                        load_url = '#goods/price?nav_type=return';
                    }else if(hash == '#buy/detail'){
                        load_url = '#buy/order';
                    }*/
                    if(load_url){
                        window.location.href =  load_url;
                    }
                    window.location.href = window.location.href.replace(/shop\/detail\?shop_id=(\d+)/,"shop/detail?shop_id="+shop_id);
                    window.location.reload();

                }
            }else{
                swal(item.msg ? item.msg : '系统繁忙，请稍后再试', false, "warning",1500);
            }
        },error: function(){
            $overlay.remove();
            swal('系统繁忙，请稍后再试', false, "warning");
        }});
        return false;
    });
});
/**
 * 表单验证
 * @param $obj
 */
function validationForm($obj){
    var $overlay = $('<div id="loadinggif"></div>');
    var $modal = $obj.parents('.modal');
    var modal_content = $obj.closest('.modal-content');
    var valid = $obj.Validform({
        tiptype:function(msg,o,cssctl){
            //msg：提示信息;
            //o:{obj:*,type:*,curform:*}, obj指向的是当前验证的表单元素（或表单对象），type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态, curform为当前form对象;
            //cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）;
            if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
                var $objgroup = o.obj.closest('.form-group');
                var objtip = $objgroup.find(".help-block");
                $objgroup.removeClass('has-info has-success has-error has-warning');
                if(o.type == 1){
                    $objgroup.addClass('has-info');
                }else if(o.type == 2){
                    $objgroup.addClass('has-success');
                }else if(o.type == 3){
                    $objgroup.addClass('has-error');
                }else if(o.type == 4){
                    $objgroup.addClass('has-warning');
                }
                //cssctl(objtip,o.type);
                objtip.text(msg);
            }
        },
        ignoreHidden:false,
        showAllError:true,
        ajaxPost: true,
        datatype:{
            "p6-16" :/^[a-zA-Z0-9_]{6,16}$/,     //密码验证,
            "mobile" : /^1[0-9]{10}$/,   //手机
            "phone" : /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,//座机
            decmall:/^[0-9]+\.[0-9]+$/,//浮点数
            font_cn:/^[\u4e00-\u9fa5]+$/,//中文
            id_card:/(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x)$)/i,//身份证
            "money":/^(([0-9]+\.[0-9]*[0-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
            "bar_code":/^[a-zA-Z0-9]{3,32}$/,
            "num":/^[1-9]\d*$/,//非0数字
        },
        beforeSubmit:function(){

            if($modal.attr('class')){
                $overlay.css({height:modal_content.height()});
                modal_content.append($overlay);
            }else{
                $overlay.css({height:$(document).height()});
                $overlay.appendTo("#contentbox");
            }
            //密码隐藏
            if($(':password',$obj).length > 0){
                $(':password',$obj).each(function (index, pwd_obj) {
                    var pwd = $(pwd_obj).val();
                    $(pwd_obj).val($.base64.encode(pwd));
                });
            }
        },
        callback: function(json){
            console.log(json);
            $overlay.remove();
            var item = json.item;
            //密码恢复
            if($(':password',$obj).length > 0){
                $(':password',$obj).each(function (index, pwd_obj) {
                    var pwd = $(pwd_obj).val();
                    $(pwd_obj).val($.base64.decode(pwd));
                });
            }
            if(json.status == 1){
                $('#batch-form').children().remove();
                try{
                    check_logout(json);//登录超时检验
                }catch(error){
                }
                var reload_url = '';
                if($modal.attr('class')){
                    reload_url = $modal.find('#url').text();
                    if(!reload_url){
                        reload_url = $('#ajax-page #url').text();
                    }

                }else{
                    reload_url = $('#ajax-page #url').text();
                }

                if(item.msg){

                    if($modal.attr('class')){
                        modal_content.find('.modal-header').children().hide();
                        $('.modal-footer',modal_content).hide();
                        var success_tip = $('<div class="success-tip"><span class="tip-content">'+(item && item.msg ? item.msg : '操作成功')+'</span></div>');
                        success_tip.appendTo($modal.find('.modal-header'));
                        setTimeout(function(){
                            success_tip.remove();
                            modal_content.find('.modal-header').children().show();
                            $('.modal-footer',modal_content).show();
                            if(!$obj.attr('modal-show')){
                                $('.modal').modal('hide');
                                $('.modal-backdrop').remove();
                                $('body').removeClass('modal-open');
                            }
                            if (item.url) {
                                window.location.href = item.url;
                            }else{

                                if(reload_url.length > 0){
                                    var load_area = $obj.attr('data-reload') ? $obj.attr('data-reload') : '#shangpingzhanshi';
                                    $(this).zm_ajax({content_area : load_area,content_url: reload_url,loading_html:''});
                                    if($('.floatthead').attr('class')){
                                        resetheadwidthx();
                                    }

                                }else{
                                    window.location.reload();
                                }
                            }

                        },400);
                    }else{

                        swal({title:item.msg ,text:false,type:"success",timer:800},function(){
                            sweetAlert.close();
                            if (item.url) {
                                window.location.href = item.url;
                            }else{
                                if(reload_url.length > 0){
                                    var load_area = $obj.attr('data-reload') ? $obj.attr('data-reload') : '#shangpingzhanshi';
                                    $(this).zm_ajax({content_area : load_area,content_url: reload_url,loading_html:''});
                                    if($('.floatthead').attr('class')){
                                        resetheadwidthx();
                                    }
                                }else{
                                    window.location.reload();
                                }
                            }
                        });
                    }

                }else{
                    if (item.url) {
                        window.location.href = item.url;

                    }else{
                        if(reload_url.length > 0){
                            var load_area = $obj.attr('data-reload') ? $obj.attr('data-reload') : '#shangpingzhanshi';
                            $(this).zm_ajax({content_area : load_area,content_url: reload_url,loading_html:'<div class="hide"></div>>'});
                            if($('.floatthead').attr('class')){
                                resetheadwidthx();
                            }
                        }else{
                            window.location.reload();
                        }
                    }
                }


            }else{

                if($modal.attr('class')){
                    $modal.find('.modal-header').children().hide();
                    $('.modal-footer',$modal).hide();
                    var $error_tip = $('<div class="error-tip"><span class="tip-content">'+(item && item.msg ? item.msg : '系统繁忙，请稍后再试')+'</span></div>');
                    $error_tip.appendTo($modal.find('.modal-header'));
                    setTimeout(function(){
                        $error_tip.remove();
                        $modal.find('.modal-header').children().show();
                        $('.modal-footer',$modal).show();
                    },2000);
                }else{
                    swal(item.msg ? item.msg : '系统繁忙，请稍后再试', false, "warning",1500);
                }
            }

        }
    });
    return valid;
}

function modal_load(btn,modal){
    $('body').on('click',btn,function(){
        var href = $(this).attr('href');
        var $overlay = $('<div id="loadinggif"></div>');
        $overlay.appendTo("#contentbox");
        $(modal).load(href,function(result){
            $overlay.remove();
            try{
                var json = $.parseJSON(result);
                check_logout(json);//登录超时检验
            }catch(error){
                $(modal).modal('show');
            }

        });
        return false;
    });
}
//<script type="text/javascript">
    $('#date-range-picker').daterangepicker({
        //maxDate: '2017-04-26'
    }).on('apply.daterangepicker', function (ev, picker) {
        $('#search-form').submit();
        return false;
    });
$(".chosen-select").chosen({disable_search: true});


//</script>
//登录超时检验
function check_logout(json){
    if(json.item.mark == 9999){
        $('.modal').modal('hide');
        if(json.item.msg){
            swal({title:json.item.msg ? json.item.msg : '登录超时，请重新登录',text:false,type:"warning"},function(){
                sweetAlert.close();
                if(json.item.url){
                    window.location.href = json.item.url;
                }else{
                    window.location.reload();
                }

            });
        }else{
            if(json.item.url){
                window.location.href = json.item.url;
            }else{
                window.location.reload();
            }
        }


        return false;
    }
}
//获取当前时间
 function dateTime(d){
    var mydate = new Date();
    var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
    var y =date.getFullYear();
    var m= (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1);
    var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
    return y+'-'+m+'-'+d;
}
function dateTimes(){
    var mydate = new Date();
    var y =mydate.getFullYear();
    var m= (mydate.getMonth()+1)<10?('0'+(mydate.getMonth()+1)):(mydate.getMonth()+1);
    var d= mydate.getDate()<10?('0'+mydate.getDate()):mydate.getDate();
    return y+'-'+m+'-'+d;
}

//设置初始化时间值

    var dateTimes=dateTimes();
console.log(dateTimes)
    $('#date-range-picker').val(dateTimes+' - '+dateTimes);
    var btn=$('#search-form button');
    for(var i=0;i<btn.length;i++){
        var dataTypeVal=$(btn[i]).attr('data-type');
        if(dataTypeVal==1){

            $(btn[i]).attr('data-daterange',dateTimes+' - '+dateTimes)
        }else if(dataTypeVal==7){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear();
                var m= (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1);
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(1);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }else if(dataTypeVal==2){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear();
                var m= (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1);
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(7);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }else if(dataTypeVal==3){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear();
                var m= (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1);
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(15);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }else if(dataTypeVal==4){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear();
                var m= (date.getMonth()+1)<10?('0'+(date.getMonth())):(date.getMonth());
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(0);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }else  if(dataTypeVal==5){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear();
                var M=date.getMonth()-5;
                if(M==-2){M=10}else  if(M==-1){M=11}else if(M==0){M=12}else if(M==-3){M=9}else if(M==-4){M=8}else if(M==-5){M=7}
                var m= (M)<10?('0'+(M)):(M);
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(0);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }else  if(dataTypeVal==6){
            function dateTime(d){
                var mydate = new Date();
                var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
                var y =date.getFullYear()-1;
                var M=date.getMonth()-5;
                if(M==-2){M=10}else  if(M==-1){M=11}else if(M==0){M=12}else if(M==-3){M=9}else if(M==-4){M=8}else if(M==-5){M=7}
                var m= (M)<10?('0'+(M)):(M);
                var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
                return y+'-'+m+'-'+d;
            }
            var a= dateTime(0);
            $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
        }
    }


//timeInit();
//快捷时间筛选
$('#contentbox').on('click', '#search-form button', function () {
    var $sub_form = $(this).closest('form');
    var data_daterange = $(this).attr('data-daterange');
    $sub_form.find('input[name=date_range]').val(data_daterange);
    $(this).closest('#search-form ').find('button').removeClass('btn-success');
    $(this).addClass('btn-success');
    $sub_form.submit();
    return false;
});










