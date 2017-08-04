/**
 * Created by Administrator on 2017/8/3.
 */
function menuTab(){
    var meunHtml='',usualHtml='';

    $('.menuTab').empty();
    $('.nav-list-usual').empty();
    $.ajax({
        url:"../data/tabMenuList.json",
        type:"GET",
        data:'',
        success: function (data) {
            var data=data.list;
            for(var i=0;i<data.length;i++){
                meunHtml+='<li data-index="'+i+'-0"><a href="'+data[i].url+'?mid='+data[i].mid+'">\
                        <i class="'+data[i].icon+'"></i>\
                        <span class="menu-text"> '+data[i].title+' </span>\
                        </a><div class="submenus">';

                for(var j=0;j<data[i].children.length;j++){
                    var children=data[i].children[j];
                    meunHtml+=' <ul>';
                    if(children.title!=""){
                        meunHtml+=' <div class="tab-title font-menu"><b class="square"></b>'+children.title+'</div>';
                    }

                    for(var k=0;k<children.child.length;k++){

                        //
                        meunHtml+='<li data-index="'+i+'-'+k+'"><a href="'+children.child[k].url+'" class="font-link">\
                                        <span>'+children.child[k].title+'</span>';
                        if(children.child[k].status!=''){
                            meunHtml+=' <div class="prompt-text">'+children.child[k].status+'</div>';
                        }
                        meunHtml+='</a></li>';
                        if(children.child[k].usual==true){
                            usualHtml+='<li><a href="'+children.child[k].url+'">\
                                            <span class="menu-text">'+children.child[k].title+'</span></a></li>';
                        }
                        //console.log(children.child[k].usual)
                    }
                    meunHtml+='</ul>';


                }


                meunHtml+= '</div></li>';
            }
            $('.nav-list-usual').append(usualHtml);
            $('.menuTab').append(meunHtml);


        },
        error: function () {
            alert('网络延迟或服务器端错误')
        }
    })
}
menuTab();
$(document).on('mouseover','.left-table-list>ul>li', function () {
    var offsetTop=$(this).offset().top;
    $(this).find('.submenus').stop().css('top',offsetTop);
})
function bodyContainerHeight(){

    var bodyoffsetHeight=$('.body-content').offset().top;
    var bodyHeight=  document.documentElement.clientHeight;

    $('.body-content').height(bodyHeight-bodyoffsetHeight);
    $('iframe').height(bodyHeight-bodyoffsetHeight);
}
bodyContainerHeight();
window.onresize=function(){
    var bodyoffsetHeight=$('.body-content').offset().top;
    var bodyHeight=document.documentElement.clientHeight;
    var bodyWidth=document.documentElement.clientWidth;
    $('.body-content').height(bodyHeight-bodyoffsetHeight);
    $('iframe').height(bodyHeight-bodyoffsetHeight);
}

$(document).on('click','.menuTab a', function (e) {
    e.preventDefault();
    var src=$(this).attr('href');

    var liIndex=$(this).parent().attr('data-index');
    sessionStorage.setItem('statusIndex',liIndex)

    sessionStorage.setItem('frameidSrc',src)
    $('#frameid').attr('src',src);

})
window.onload= function () {
    var onloadSrc;
    var mouseDownHref=sessionStorage.getItem('mouseDownHref');
    sessionStorage.removeItem('mouseDownHref')
    onloadSrc=sessionStorage.getItem('frameidSrc') || '../system/system_info.html';
    if(mouseDownHref!==null){
        onloadSrc=mouseDownHref
    }
    console.log(onloadSrc)
    $('#frameid').attr('src',onloadSrc);


}

//密码验证
$('#pwd-revise').validate({
    rules: {
        pwdLong: {
            required: true,
            minlength : 11,
        },
        newPwd: {
            required: true,
            minlength : 6,
        },
        affirmPwd: {
            equalTo: "#newPwd"
        }
    },
    messages: {
        pwdLong:{
            required:"请输入原密码",
            minlength:"请输入6-16位密码"
        } ,
        newPwd: {
            required:"请设置新密码",
            minlength:"请输入6-16位新密码"
        },
        affirmPwd:"输入与新密码不一致"
    },
    onfocusout: function(element){
        $(element).valid();
    },
    submitHandler: function (form) {
        var newPwd=$('#newPwd').val();
        console.log(password)


    },
    debug: true,
    success:function(){

    }
})

//系统消息点击
$(document).on('click','#message-info li', function (e) {
    e.preventDefault();
    var href=$(this).find('a').attr('href');
    console.log(href)
    href= href.split('#')[1]
    $('#frameid').attr('src',href)
})
var mouseDownHref,statusIndex;
$(document).on('contextmenu','a',function(event){
    event.preventDefault();
    //$(this).parents('.submenus').show();
    var _this=this
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
    var cliY = event.clientY ;
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
$('#rightMenu').on('contextmenu',function(){
    return false;
})
$(document).on('click','#rightMenu div',function(){
    var clickType=$(this).attr('data-type');
    window.open('../main/index.html')


})
$(document).on('click','body',function(){
    $('#rightMenu').remove()
})

$('.name-show button').click(function(){
    $('.name-show').hide();
    $('.name-input').show();
});
$('.name-input button').click(function(){
    $('.name-show').show();
    $('.name-input').hide();
    var user_name = $('.name-input input').val();
    if(user_name){
        $('.name-show .user-name').text(user_name);
    }
});