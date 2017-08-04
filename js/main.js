/**
 * Created by Administrator on 2017/7/18.
 */
//拖动模态框
$( ".modals .modals-dilog" ).draggable();

//图片上传
$(document).on('change','.uploadImg', function () {
    var img=$(this).siblings('.img')[0];
    var uploadImg=$(this)[0];
    change(img,uploadImg)
})
function change(pic,file) {

    var ext=file.value.substring(file.value.lastIndexOf(".")+1).toLowerCase();

    var isIE = navigator.userAgent.match(/MSIE/)!= null,
        isIE6 = navigator.userAgent.match(/MSIE 6.0/)!= null;

    if(isIE) {
        file.select();
        var reallocalpath = document.selection.createRange().text;


        if (isIE6) {
            pic.src = reallocalpath;
        }else {
            pic.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='image',src=\"" + reallocalpath + "\")";
            pic.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
        }
    }else {
        //html5Reader(file,pic);
        var file = file.files[0];
        var reader = new FileReader();
        console.log(file,reader)
        reader.readAsDataURL(file);
        reader.onload = function(e){
            //var pic = document.getElementById("preview");
            pic.src=this.result;
        }
    }
}


function bodyContainerHeight(){

    var bodyoffsetHeight=$(window.parent.document).find('.body-content').offset().top;
    var bodyHeight=  window.parent.innerHeight;
    //console.log(bodyoffsetHeight,bodyHeight)
    $('.body-content').height(bodyHeight-bodyoffsetHeight);
}
bodyContainerHeight();
window.onresize=function(){
    var bodyoffsetHeight=$(window.parent.document).find('.body-content').offset().top;
    var bodyHeight=  window.parent.innerHeight;
    $('.body-content').height(bodyHeight-bodyoffsetHeight);
}
//表格加载
function jqgridTable(data){
    var aa=['1','2','3']
    var footFun=data.footerrowFun;
    $(data.tableId).jqGrid({
        url: data.url,
        datatype: "json",
        mtype: "post",
        colModel:data.colModel,
        jsonReader:{
            root:'rows',
            page:'pageIndex',
            total:'totalPage',
            records:'0',
            repeatitems:false
        },
        footerrow:data.footerrow,//统计
        multiselect:data.multiselect,  //是否多选
        rownumbers:true,  //行序号
        rownumWidth:80,   //行序号宽
        //userDataOnFooter: true,

        height: data.height,
        autoScroll: true,
        autowidth: false, shrinkToFit: true,
        cellEdit:data.cellEdit,
        cellsubmit:'clientArray',
        editurl:"",//编辑路径
        sortable:true,
        sortorder :"desc",
        scrollOffset:1,
        subGridWidth:0,
        styleUI:'Bootstrap',
        altRows:true,
        viewrecords : true,
        pager:data.pagerId,
//                autowidth: false, shrinkToFit: true,
        rowNum:16,
        rowList:[10,20,30],
        beforeEditCell:function(rowid,cellname,value,iRow,iCol){
            lastrow =iRow;
            lastcell =iCol;

//                    console.log(lastrow,lastcell)
        },
        afterInsertRow: function (rowid) {
            $('#'+rowid).attr('data-id',aa[(rowid-1)]);
        },
        afterSaveCell :footFun,
        loadComplete : function() {
            var table = this;
            setTimeout(function(){
                updatePagerIcons(table);
            }, 0);
            jqgridOverflowX();
        },
        gridComplete: footFun
        //合计方法
    });
}
function jqgirdDate(data){
    var footFun=data.footerrowFun;
    console.log(footFun)
    //debugger
    $(data.tableId).jqGrid({
        data: data.data,
        datatype: "local",
        mtype: "post",
        colModel:data.colModel,
        footerrow:data.footerrow,//统计
        rownumbers:true,  //行序号
        rownumWidth:80,   //行序号宽
        multiselect:data.multiselect,  //是否多选
        height: data.height,
        shrinkToFit:false,
        autoScroll: true,
        cellEdit:data.cellEdit,
        cellsubmit:'clientArray',
        editurl:"",//编辑路径
        sortable:true,
        scrollOffset:1,
        subGridWidth:0,
        styleUI:'Bootstrap',
        altRows:true,
        viewrecords : true,
        pager:data.pagerId,
//                autowidth: false, shrinkToFit: true,
//        rowNum:10,
//        rowList:[10,20,30],
        beforeEditCell:function(rowid,cellname,value,iRow,iCol){
            lastrow =iRow;
            lastcell =iCol;

//                    console.log(lastrow,lastcell)
        },
        afterSaveCell :footFun,
        loadComplete : function() {
            var table = this;
            setTimeout(function(){
                updatePagerIcons(table);
            }, 0);
            jqgridOverflowX();
        },
        afterInsertRow: function (rowid) {
            //if(data.data[(rowid-1)].companyId){
            //    $('#'+rowid).attr('data-id',data.data[(rowid-1)].companyId);
            //}
        },
        gridComplete: footFun
        //合计方法
    });
}
//图表数据统计出来
function getColTotal(data){
    for(var i= 0,num=null;i<data.length;i++){
        if(data[i].value==''){
            data[i].value=0;
            num+=parseFloat(data[i].value);
        }else {
            num+=parseFloat(data[i].value);
        }
    }
    return num;
}
//添加行
function btn_add(gid){
    var rowData = {
        "id":ids
    };
    var ids = $(gid).jqGrid('getDataIDs');//获取行总数
    var newrowid=parseInt(ids[ids.length-1])+1;
    //获得新添加行的行号（数据编号）
//        newrowid = rowid+1;
    $(gid).jqGrid("addRowData", newrowid, rowData, "last");
    //$('#'+newrowid).find('td:first-child').html(newrowid);
    $('#'+newrowid).find('.icon-plus').attr('onclick','btn_add("'+gid+'")');
    $('#'+newrowid).find('.icon-remove').attr('onclick','btn_delete('+newrowid+',"'+gid+'")');

}
//删除行
function btn_delete(id,gid){
    if($('#'+id).siblings().length-1 ==0){
        return;
    }
    jQuery(gid).jqGrid('delRowData', id);
}

function updatePagerIcons(table) {
    var replacement =
    {
        'ui-icon-seek-first' : 'icon-double-angle-left bigger-140',
        'ui-icon-seek-prev' : 'icon-angle-left bigger-140',
        'ui-icon-seek-next' : 'icon-angle-right bigger-140',
        'ui-icon-seek-end' : 'icon-double-angle-right bigger-140'
    };
    $('.ui-pg-table:not(.navtable) > tbody > tr > .ui-pg-button > .ui-icon').each(function(){
        var icon = $(this);
        var $class = $.trim(icon.attr('class').replace('ui-icon', ''));

        if($class in replacement) icon.attr('class', 'ui-icon '+replacement[$class]);
    })
}
function jqgridOverflowX(){
    $('.ui-jqgrid').css('max-width','100%')
    $('.ui-corner-bottom').css('max-width','100%')
    $('.ui-jqgrid-view').css('width','100%').css('overflow','auto');

    $('div[id$="_rn"]').html("序号").addClass('center').css('padding-top','0')
}
////删除行
//function btn_delete(id,gid){
//    jQuery(gid).jqGrid('delRowData', id);
//}

//直接打开模态框
$(document).on('click','.open-modals', function () {


    $('.modals-bg', parent.document).addClass('active');
    $('#frameid', parent.document).css('z-index','22')
    var openClass=$(this).attr('data-open');
    var modalHead=$(this).attr('data-head');
    //console.log(modalHead)
    $('.'+openClass+' .modals-head>span').html(modalHead);
    //console.log(openClass)
    $('.'+openClass).show();
    $('.'+openClass).attr('data-status',true)
    $('.'+openClass+' .help-block ').hide();
    $('.'+openClass+' label.error ').hide();
    if(openClass=='addPay'){
        var dataType=$(this).attr('data-type')
        $('.'+openClass).find('.addTypeEdit').attr('data-type',dataType);
    }
    if(openClass=='addTypeEdit'){
        var payStatus=$(this).attr('data-type');
        if(payStatus=="1"){
            $('.'+openClass+' .modals-head>span').html('编辑收入分类');

        }else if(payStatus=="2"){
            $('.'+openClass+' .modals-head>span').html('编辑支出分类');
        }
        localStorage.setItem('addTypeEditStatus',payStatus)
    }
})
//关闭模态框
$(document).on('click','.closeModals', function () {



    $(this).parents('.modals').attr('data-status',false);
    var modalsStatus=$('.modals');
    var modalsStatusNum=0;
    //判断是否还有没有关闭的模态框
    for(var i=0;i<modalsStatus.length;i++){
        var dataStatus=$(modalsStatus[i]).attr('data-status');
        if(dataStatus=="true"){
            modalsStatusNum++;
        }
    }
    if(modalsStatusNum==0){
        $('.modals-bg', parent.document).removeClass('active');
        $('#frameid', parent.document).css('z-index','0')
    }
    $(this).parents('.modals').hide();
    if( $(this).parents('.modals').find('.editSave').length>0){
        $('.editSave').removeClass('editSave')
    }
})
//自定义select
var selectflag=false;
//关闭下拉款
$(document).on('click', function () {
    if(selectflag==true){
        $('.select-down').hide(200);
        selectflag=false
    }

})
$(document).on('click',".select-box .bill-input input", function (e) {
    e.preventDefault();
    if(selectflag==false){
        $(this).parent().siblings('.select-down').show(300);
        selectflag=true;
        return false
    }else if(selectflag==true){
        $(this).parent().siblings('.select-down').hide(300);
        selectflag=false
    }
})
$(document).on('click',".select-box .select-list", function () {
    var selectHtml=$(this).html();
    var dataId=$(this).attr('data-id');
    //debugger
    $(this).parent().siblings('.bill-input').find('input').val(selectHtml);
    $(this).parent().siblings('.bill-input').find('input').attr('data-id',dataId)
    $(this).parent().hide();
})
//验证表单
$(document).on('blur','.form-group input', function () {
       //debugger
    //if( $(this).sibling('.error').length>0){
    //    $(this).sibling('.error').hide()
    //}
    if(  $(this).parent().siblings('.control-label').find('span').html()=='*'){
        if($(this).attr('name')=='supplier_code'){
            var dataType=/^[a-zA-Z0-9_]{1,20}$/;
            var thisVal=$(this).val();
            var b=dataType.test(thisVal);
            if(dataType.test(thisVal)==false && $.trim($(this).val()).length!=0){
                $(this).parents('.form-group').find('.help-block').html( $(this).attr('errormsg'));
                //console.log( $(this).attr('nullmsg'))
                $(this).parents('.form-group').find('.help-block').show();
            }
            //debugger;
        }
        //if($.trim($(this).val()).length>0){
        //    return;
        //}else
        if($.trim($(this).val()).length==0){

            $(this).parents('.form-group').find('.help-block').html( $(this).attr('nullmsg'));
            //console.log( $(this).attr('nullmsg'))
            $(this).parents('.form-group').find('.help-block').show();
        }

    }
})
//验证手机
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    var mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
    return this.optional(element) || (length == 11 && mobile.test(value));
}, "请正确填写您的手机号码");
$(document).on('focus','.form-group input', function () {
    $(this).parent().siblings('.help-block').hide();
    $(this).siblings('.help-block').hide();
})


//清空筛选条件
$(document).on('click', '.reset', function () {
    var form_obj = $(this).closest('form');
    var nav_type = form_obj.find('input[name=nav_type]').val();
    form_obj.find('input').val('');
    form_obj.find('select').val('');
    $('.quick-select a,.quick-select .btn', form_obj).removeClass('btn-success').addClass('btn-white');
    //下拉框
    form_obj.find("select").trigger("chosen:updated.chosen");
    form_obj.find('input[name=nav_type]').val(nav_type);
    $(this).parents('form').find('.goods_son_id option').html('<option value="">全部</option>')
    //var defeaultHtml=$('.select-down>div:first-child').html();
    var ele=form_obj.find('.select-down')
    $.each(ele, function (index,element) {
        console.log(index)
        $(this).find('div')
    })

//        form_obj.submit();
    return false;
});
//公共分类选择

$(document).on('change','.goods_type_id', function (evt, params) {
    console.log(evt,params)
    var _this=this;
    var selectVal=$(this).find('option:selected').val()
    if(selectVal>0){
        $.ajax({
            type: 'POST',
            async: false,
            dataType: 'json',
            data: {id: selectVal},
            url: '../data/shop/get_category.json',
            success: function (json) {
                console.log(json)
                //check_logout(json);//登录超时检验
                if (json.status == 1) {
                    $.each(json.item.list, function (index, val) {
                        $(_this).parents('.boxpart').find(".goods_son_id").append("<option value='" + val['type_id'] + "'>" + val['type_name'] + "</option>");
                    });
                }
            }
        });
    }
})
//日期加载
if( $('.datepicker').length>0 ){
    $('.datepicker').datetimepicker({
        lang:"ch", //语言选择中文 注：旧版本 新版方法：$.datetimepicker.setLocale('ch');
        format:"Y-m-d H:m",      //格式化日期
        hourText: '小时',
        minuteText: '分钟'
        //timepicker:true,    //关闭时间选项
        //yearStart:2000,     //设置最小年份
        //yearEnd:2050,        //设置最大年份
        //todayButton:false    //关闭选择今天按钮
    });
    var defaultTime=dateTimes();
    $('.datepicker').val(defaultTime)
}

var modal = (function() {
   var initDate = function(startDateTimeId,endDateTimeId) {
               var startDate;
         var endDate;
          startDateTimeId="."+startDateTimeId;
         endDateTimeId="."+endDateTimeId;
          $(startDateTimeId).datetimepicker({
              format: 'Y-m-d H:m',

               //minDate: 0,
               onChangeDateTime: function(dp, $input) {
                      startDate = $(startDateTimeId).val();
                 },
               onClose: function(current_time, $input) {
                        if (startDate > endDate) {
                              $(startDateTimeId).val(endDate);
                              startDate=endDate;
                         }
                     }
               });
    /*   $(startDateTimeId).datetimepicker({
           minView: "month",
           language:  'zh-CN',
           format: 'Y-m-d H:m',

           pickerPosition: "bottom-left"
       }).on('changeDate',function(ev){
           var starttime=$(startDateTimeId).val();
           $(endDateTimeId).datetimepicker('setStartDate',starttime);
           $(startDateTimeId).datetimepicker('hide');
       });
       $(endDateTimeId).datetimepicker({
           minView: "month",
           language:  'zh-CN',
           format: 'Y-m-d H:m',

           pickerPosition: "bottom-left"
       }).on('changeDate',function(ev){
           var starttime=$(startDateTimeId).val();
           var endtime=$(endDateTimeId).val();
           $(startDateTimeId).datetimepicker('setEndDate',endtime);
           $(endDateTimeId).datetimepicker('hide');
       });   */
            $(endDateTimeId).datetimepicker({
                  format: 'Y-m-d H:m',
                  maxDate:'+1970/01/2',
                  onClose: function(current_time, $input) {
                      endDate = $(endDateTimeId).val();
                      if (startDate > endDate) {
                          $(endDateTimeId).val(startDate);
                         endDate=startDate;
                      }
                   }
            });
       };
       return {
            initDate: initDate
     };
    })();

//打印/导出
$('#contentbox').on('click', '.btn-iframe', function () {
    var data_url = $(this).attr('data-url');
    var search_form = $(this).attr('data-form');
    if (search_form) {
        var post_data = $(search_form).serialize();
        data_url = data_url + '&' + post_data
    }
    $('#common-iframe').attr('src', data_url);
    return false;
});
//导入
$(document).on('click','#daoruexcel', function () {
    $('#import-goods-form').show();
})


//角色筛选
function roleInit(data,elem){
    if( $(elem +'.select-list').length>0 ){
        $(elem).empty();
    }

    var str='';
    for(var i=0;i<data.length;i++){
        str+=' <div class="select-list" data-id="'+data[i].jobId+'">'+data[i].jobName+'</div>'
    }
    $(elem).append(str);
    $(elem).siblings('.bill-input').find('input').val(data[0].jobName).attr('data-Id',data[0].jobId)
}
//店铺筛选
function shopSelectInit(data){
    var str='<div class="select-list" data-id="12">全部</div>';
    for(var i=0;i<data.length;i++){
        str+=' <div class="select-list" data-id="'+data[i].companyId+'">'+data[i].companyName+'</div>'
    }
    $('.shop-select').siblings('.bill-input').find('input').val('全部').attr('data-id','12')
    $('.shop-select').append(str);

}

//分页点击事件
$(document).on('click', '.pagebtn li a', function (e) {
    e.preventDefault();
    $(this).parent().siblings('li').removeClass('active')
    $(this).parent().addClass('active');
    var index = $(this).parent().index();
    console.log(index,$('.pagebtn li').length)
    if (index == 0) {
        $(this).parents('ul').prev('a').addClass('disabled')
    } else {
        $(this).parents('ul').prev('a').removeClass('disabled')
    }

    if (index == ($('.pagebtn li').length-1)) {
        $(this).parents('ul').next('a').addClass('disabled')
    } else {
        $(this).parents('ul').next('a').removeClass('disabled')
    }

})

//开关切换
$(document).on('click','.switch-box', function () {
    $(this).attr('class')=='switch-box close1'?$(this).attr('class','switch-box open1'):$(this).attr('class','switch-box close1');
    $(this).find('.switch-content').attr('class')=='switch-content close2'?$(this).find('.switch-content').attr('class','switch-content open2')
        :$(this).find('.switch-content').attr('class','switch-content close2');

})

//自动修正优惠金额和应付金额
$(document).on('blur', 'input[name=discount_money]', function () {
    var total_money = parseFloat(143).toFixed(2);
    var payed_money = parseFloat(0).toFixed(2);
    var dis_money = parseFloat(0).toFixed(2);
    var this_val = parseFloat($(this).val()).toFixed(2);
    this_val = this_val > 0 ? this_val : 0;

    if (this_val > total_money - payed_money - dis_money) {
        swal('实付金额与优惠金额之和不能大于应付金额', false, "warning", 1500);
    }
});
//自动修正应付金额
$(document).on('blur', 'input[name=pay_money]', function () {
    var $payform=$(this).parents('.pay-form')
    var total_money=$payform.find('.pay-total').html();
    total_money=total_money.split('￥')[1];
    //var total_money = parseFloat(143).toFixed(2);
    var payed_money = parseFloat(0).toFixed(2);
    var dis_money = parseFloat(0).toFixed(2);
    var discount_money = parseFloat($('.pay-form input[name=discount_money]').val()).toFixed(2);
    var this_val = parseFloat($(this).val()).toFixed(2);
    discount_money = discount_money > 0 ? discount_money : 0;
    this_val = this_val > 0 ? this_val : 0;
    if (this_val > (total_money - payed_money - dis_money - discount_money)) {
        // $(this).val(parseFloat(total_money - payed_money  - dis_money - discount_money).toFixed(2));
        swal('实付金额与优惠金额之和不能大于应付金额', false, "warning", 1000);
    }
});


//快捷查询切换
$(document).on('click','.quick-select button',function(){
    $(this).attr('class','btn date_type default btn-success');
    $(this).siblings('button').attr('class','btn date_type btn-white');
    $(this).css('border','none')
})
$(document).on('click','.btn-group button', function () {
    $(this).attr('class','btn date_type default btn-success');
    $(this).siblings('button').attr('class','btn date_type btn-white');
})

//关闭导入
$(document).on('click','.guanbituanchuk',function(){
    $(this).parents('.tanchukuan1').hide();
})
window.onload=function(){
    var href=window.location.href;
    sessionStorage.setItem('frameidSrc',href);
    var statusIndexRight=sessionStorage.getItem('statusIndexRight');
    sessionStorage.removeItem('statusIndexRight')
    var statusIndex=sessionStorage.getItem('statusIndex') || '0-0';
    if(statusIndexRight!==null){
        statusIndex=statusIndexRight
    }
    statusIndex=statusIndex.split('-');
    var parents=$(window.parent.document);
    parents.find('.menuTab>li').removeClass('active')
    parents.find('.menuTab>li').eq(statusIndex[0]).addClass('active');
    parents.find('.menuTab>li .submenus li').removeClass('bar')
    parents.find('.menuTab>li').eq(statusIndex[0]).find('.submenus li').eq(statusIndex[1]).addClass('bar')
}
//alert( window.location.href)
//获取当前时间
function dateTimes(){
    var mydate = new Date();
    var y =mydate.getFullYear();
    var m= (mydate.getMonth()+1)<10?('0'+(mydate.getMonth()+1)):(mydate.getMonth()+1);
    var d= mydate.getDate()<10?('0'+mydate.getDate()):mydate.getDate();
    return y+'-'+m+'-'+d;
}

//获取时间差
function dateTime(d){
    var mydate = new Date();
    var date = new Date(mydate.getTime() - d * 24 * 3600 * 1000);
    var y =date.getFullYear();
    var m= (date.getMonth()+1)<10?('0'+(date.getMonth()+1)):(date.getMonth()+1);
    var d= date.getDate()<10?('0'+date.getDate()):date.getDate();
    return y+'-'+m+'-'+d;
}
var btn=$('#search-form button');
var dateTimes=dateTimes();
for(var i=0;i<btn.length;i++){
    var dataTypeVal=$(btn[i]).attr('data-type');

    if(dataTypeVal==1){

        $(btn[i]).attr('data-daterange',dateTimes+' - '+dateTimes)
    }else if(dataTypeVal==7){

        var a= dateTime(1);
        $(btn[i]).attr('data-daterange',a+' - '+dateTimes)
    }else if(dataTypeVal==2){
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

$(document).on('contextmenu','a',function(event){
    event.preventDefault();
    var _this=this;
   clickRight(_this,event);
})
function clickRight(_this,event){
    mouseDownHref=$(_this).attr('href');
    var statusIndex=$(_this).parent().attr('data-index');
    sessionStorage.setItem('mouseDownHref',mouseDownHref)
    sessionStorage.setItem('statusIndexRight',statusIndex)
    $('#rightMenu').remove()
    var str='<div id="rightMenu"><div data-type="'+mouseDownHref+'">点击打开新窗口</div></div>';
    $('body').append(str);
    var cliY = event.clientY;
    var cliX = event.clientX;
//        最大宽高
    var maxWidth = document.documentElement.offsetWidth - $('#rightMenu').width()-2;
    var maxHeight = document.documentElement.offsetHeight - $('#rightMenu').height()-2;
//        debugger;
    cliX=cliX>maxWidth?(cliX=maxWidth):cliX;
    cliY=cliY>maxHeight?(cliY=maxHeight):cliY
    $('#rightMenu').css({
        top:cliY+ "px",
        left:cliX+ "px"
    })
    return false;
}
$(document).on('click','body',function(){
    $('#rightMenu').remove()
})
$('#rightMenu').on('contextmenu',function(){
    return false;
})

$(document).on('click','#rightMenu div',function(){
    var clickType=$(this).attr('data-type');
    window.open('../main/index.html')


})

//商品添加
var lastrow,lastcell,shopName='',clickname;
function myelem(value, options) {

    shopName='';
    var html = '<div class=" table-editinput"><input onblur=\'chooseProduct("' + lastrow + '","' + options.id + '")\' type="text" value=""/>';
    html += '</div>';
    var a = $(html);
    if (value) {
        a.find('input').val(value);
    }
    return a.get(0);
}
function myvalue(elem, operation, value) {
    //console.log(elem,operation,value)
    if (operation === 'get') {
        return $(elem[0]).find('input').val() || shopName;
    } else if (operation === 'set') {
        $('input', elem[0]).val(value);
    }
}
function chooseProduct(rowid, elemId) {
    clickname=$('#'+elemId).attr('name')
    var changeVal=$('#'+elemId).find('input').val();
    $('.shopChange').find('.modals-head span').html('商品搜索 — '+changeVal+' 单击选中商品')
    if(changeVal=='') return;
    $('.shopChange').show()
    $('.shopChange').find('.btn-save').addClass('changedata').attr('data-changeId','#shopChange-table');

    var tabelElementId=$('#'+elemId).parents('table').attr('id');

    localStorage.setItem('tabelElementId',tabelElementId)
}
$(document).on('click','.changedata',function () {

    var changeId=$(this).attr('data-changeId')
    //console.log(lastrow,clickname,changeId)
    var changeID=$('.modals .ui-state-highlight').attr('id');
    var rowData = $(changeId).jqGrid('getRowData',changeID);
    $(this).removeClass('.shop-changedata');
    $.each(rowData,function(i, n){
        //console.log(i,n)
        if(i==clickname){
            shopName=n;
        }
    });
    $(this).parents('.modals').hide();
    var tableId=localStorage.getItem('tabelElementId')
    $("#"+tableId).jqGrid("setRowData",lastrow,rowData);
    $("#"+tableId).saveRow(lastrow);

})
//小计计算
$(document).on('input','input[name="num"]',function(){
    var shopNum=$(this).val();
    var salePrice=$(this).parents('td').siblings('.stockPrice').html();
    console.log(salePrice)
    salePrice=salePrice==='&nbsp;'?0:salePrice;
    var subtotal=shopNum*salePrice;
    $(this).parents('td').siblings('.subtotal').html(subtotal.toFixed(2))
    $('#total span').html('￥'+subtotal.toFixed(2))
})
//取消父元素右键事件
$(document).on('click','body',function(){
    $(window.parent.document).find('#rightMenu').remove()
})

