/*
 *表格头随窗口浮动
 */

$(function () {
    $.fn.floattablehead = function () {
        $.each(this, function (index, obj) {
            var original = $(obj);
            var originalthwidth = [];
            original.find("th").each(function () {
                originalthwidth.push(this.offsetWidth);
            });
            var COPYoriginal = original.clone();
            var neworiginal = $("<div></div>");
            neworiginal.append(COPYoriginal);
            $(COPYoriginal).wrap('<table class="table table-bordered table-hover"></table>');
            var initnewhead = function(){
                originalthwidth.splice(0,originalthwidth.length);
                original.find("th").each(function () {
                    originalthwidth.push(this.offsetWidth);
                });
                neworiginal.css({
                    "position": "absolute",
                    "width": original.width() + 1,
                    "top": original.position().top,
                    "left": original.position().left
                });
				if((navigator.userAgent).indexOf("Firefox") > -1){
					neworiginal.css({
                    "position": "absolute",
                    "width": original.width() + 1,
                    "top": original.position().top-1,
                    "left": original.position().left-1
                });
					
				}
                $(COPYoriginal).find("th").each(function (index, obj) {
                    $(obj).css("width",originalthwidth[index]);
                });
            };
            initnewhead();
            neworiginal.appendTo($("div.table-responsive"));
            //绑定事件
            $(window).on("scroll", function () {
				
                var scrollTops = $(this).scrollTop();
                var originalTops = original.offset().top;
				
                if (scrollTops >= originalTops) {
                    neworiginal.css({
                        "top": original.position().top + (scrollTops - originalTops),
                        "left": original.position().left
                    });
					
					
					if((navigator.userAgent).indexOf("Firefox") > -1){
					neworiginal.css({
                        "top": original.position().top + (scrollTops - originalTops) -1,
                        "left": original.position().left - 1
                    });
					
				}
				
				
                }else{
                    neworiginal.css({
                        "top": original.position().top,
                        "left": original.position().left
                    });
					
					if((navigator.userAgent).indexOf("Firefox") > -1){
						
						 neworiginal.css({
                        "top": original.position().top-1,
                        "left": original.position().left-1
                    });
						
					}
                }
            });
			
			resetheadwidthx = function(){
				
				 setTimeout(function(){initnewhead();},300)
				
			}
			
			
			
			$(window).resize(function(){
			
                setTimeout(function(){initnewhead();},300)
            });

			
        });
    };
});