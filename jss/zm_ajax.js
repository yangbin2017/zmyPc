(function($) {
    //2015-10-09
    $.fn.extend({
    	zm_ajax: function(options) {
    		var defaults = {     
				content_area: '',
				content_url: false,
				content_data: {},
				loading_html: '<div id="loadinggif"></div>',
			};
			// Extend our default options with those provided.
			var opts = $.extend(defaults, options); 
			
			var url = '';
			
			if(opts.content_url){
				url = opts.content_url;
			}else{
				url = $(this).attr('href');
			}
			
			if(typeof(url) == 'undefined'){
				url = $(this).attr('action');
			}
			
			if(url == 'javascript:;' || typeof(url) == "undefined" || url.length == 0) return;
			var hash = $.trim(window.location.hash);
			var hm_hash = hash.replace('#','/');
			//百度统计
			_hmt.push(['_trackPageview', hm_hash]);

			var $contentArea = $(opts.content_area);
			
			var $overlay = $(opts.loading_html).css({height:$contentArea.height()});
			
			$overlay.remove();

			$contentArea.append($overlay);
			
			$.ajax({
				'url': url,
				'type': 'GET',
				'dataType':'JSON',
				'data': opts.content_data,
				'cache': false
			})
			.error(function() {
				$overlay.remove();
				/*
				swal({
                    title: "出错了",
                    text: "服务器繁忙或内部故障，请稍后再试",
                    confirmButtonColor: "#3696fd",
                    html: true
                });
                */
			})
			.done(function(result) {
                    $overlay.remove();
				if(result.status == 1){
                    var json = result;
                    check_logout(json);//登录超时检验
					
					var html_element = result.item.html;
				
					$contentArea.empty().html(html_element);
					try{
						var title_html = $('.new-table-headinfo').html();
						if(title_html.length > 0){
							$('.page-title').html(title_html);
						}else {
							$('.page-title').html('');
						}
					}catch (e){}
				
					//$('html,body').animate({scrollTop: 0}, 250);
				}else{
                    $('.modal').modal('hide');
                    swal({
                        title: "出错了",
                        text: result.item.msg ? result.item.msg : "服务器繁忙或内部故障，请稍后再试",
                        confirmButtonColor: "#3696fd",
                        html: true
                    });
                }

			});
        }
    });
})(jQuery);

(function($ , undefined) {
	function ZmAjax(contentArea, settings) {
		var $contentArea = $(contentArea);
		var self = this;
		$contentArea.attr('data-ajax-content', 'true');
		
		//get a list of 'data-*' attributes that override 'defaults' and 'settings'
		this.settings = $.extend({}, $.fn.menu_ajax.defaults, settings);


		var working = false;
		var $overlay = $();//empty set

		this.force_reload = false;//set jQuery ajax's cache option to 'false' to reload content
		this.loadUrl = function(hash, cache) {
			var url = false;
			hash = hash.replace(/^(\#\!)?\#/, '');
			
			this.force_reload = (cache === false)
			
			if(typeof this.settings.content_url === 'function') url = this.settings.content_url(hash);
			if(typeof url === 'string') this.getUrl(url, hash, false);
		}
		
		this.loadAddr = function(url, hash, cache) {
			this.force_reload = (cache === false);
			this.getUrl(url, hash, false);
		}
		
		
		
		this.getUrl = function(url, hash, manual_trigger) {
			if(working) {
				return;
			}
			var hm_hash = '/' + hash;
			var url_hash = '#' + hash;
			var url_hash_index = url_hash.indexOf('?');
			if(url_hash_index > 0){
				url_hash = url_hash.substr(0,url_hash_index);
				hm_hash = hm_hash.substr(0,url_hash_index);
			}
			//百度统计
			_hmt.push(['_trackPageview', hm_hash]);

			if(url_hash == '#buy/detail'){
				url_hash = '#buy/order';
			}
			if(url_hash == '#goods/transfer_detail'){
				url_hash = '#goods/transfer';
			}
			if(url_hash == '#system/open_instruction'){
				url_hash = '#system/set';
			}
			if(url_hash == '#analysis/summary' || url_hash == '#analysis/damage'  || url_hash == '#analysis/goods_sale' || url_hash == '#analysis/returns' || url_hash == '#analysis/stock' || url_hash == '#analysis/sales' || url_hash == '#analysis/stock_supplier_detail' || url_hash == '#analysis/stock_goods_detail'
					|| url_hash == '#analysis/head_goods_sale' || url_hash == '#analysis/head_inventory' || url_hash == '#analysis/head_stock' || url_hash == '#analysis/head_stock_goods_detail' || url_hash == '#analysis/head_returns' || url_hash == '#analysis/head_stock_supplier_detail' || url_hash == '#analysis/head_sales' ){
				url_hash = '#analysis/sales';
			}
			if(url_hash == '#buy/onekey'){
				url_hash = '#goods/manage';
			}
			if(url_hash == '#shop/detail' || url_hash == '#shop/payments_list'){
				url_hash = '#shop/manage';
			}
			if(url_hash == '#refund/return_detail' || url_hash == '#refund/refund_detail'){
				url_hash = '#refund/manage';
			}
			if(url_hash == '#buy/supplier_order_pay_detail'){
				url_hash = '#buy/supplier_order_pay';
			}
			if(url_hash == '#shop/supplier_order_detail'){
				url_hash = '#shop/supplier';
			}
			if(url_hash == '#goods/use_detail'){
				url_hash = '#goods/use_list';
			}
			if(url_hash == '#analysis/goods_log_detail'){
				url_hash = '#analysis/goods_log';
			}
            if(url_hash == '#house/goods_log_detail'){
				url_hash = '#house/manage';
			}
            if(url_hash == '#transfer/transfer_detail'){
                url_hash = '#transfer/manage';
            }
            if(url_hash == '#shop/work_log'){
                url_hash = '#shop/member';
            }
            if(url_hash == '#stock/stocking_detail' || url_hash == '#stock/stocked_detail' || url_hash == '#stock/stocking' || url_hash == '#stock/stocked'){
                url_hash = '#stock/stock_list';
            }
			$(".haohangteam,.erjifenlie .erji,.erjifenlie .erji div a").removeClass('active');
			
			var $obj = $("[href='"+url_hash+"']");
			$obj.addClass('active');
			var $pobj = $obj.closest('div.erji');
			$pobj.addClass('active');
			var mainindex = $('#menus .erji').index($pobj);
			$yijiobj = $('.mainchose .haohangteam').eq(mainindex);
			$yijiobj.addClass('active');	
			var lsrpart = parseInt($yijiobj.offset().left)+50;
			$('#menus').css("padding-left",lsrpart+'px');
			//$obj.parent('div').addClass('active');
			//alert($obj.attr('href'));
			$('.modal-backdrop').remove();
			$('body').removeClass('modal-open');
			var event;
			$contentArea.trigger(event = $.Event('ajaxloadstart'), {url: url, hash: hash})
			if (event.isDefaultPrevented()) return;
			
			self.startLoading();

			$.ajax({
				'url': url,
				'type': 'GET',
				'dataType':'JSON',
				'cache': !this.force_reload
			})
			.error(function() {
				$contentArea.trigger('ajaxloaderror', {url: url, hash: hash});
				
				self.stopLoading(true);
				/*
				swal({
                    title: "出错了",
                    text: "服务器繁忙或内部故障，请稍后再试",
                    confirmButtonColor: "#3696fd",
                    html: true
                });
                */
			})
			.done(function(result) {
				$contentArea.trigger('ajaxloaddone', {url: url, hash: hash});				
				if(result.status == 1){
                    var json = result;
                    check_logout(json);//登录超时检验
					
					var html_element = result.item.html;
					var link_element = null, link_text = '';

					//convert "title" and "link" tags to "div" tags for later processing
					html_element = String(html_element)
								   .replace(/<(title|link)([\s\>])/gi,'<div class="hidden ajax-append-$1"$2')
								   .replace(/<\/(title|link)\>/gi,'</div>')
				
					$overlay.addClass('content-loaded').detach();
					$contentArea.empty().html(html_element);
					try{
						var title_html = $('.new-table-headinfo').html();
						if(title_html.length > 0){
							$('.page-title').html(title_html);
						}else {
							$('.page-title').html('');
						}
					}catch (e){}

					$(self.settings.loading_overlay || $contentArea).append($overlay);
		
					//remove previous stylesheets inserted via ajax
					setTimeout(function() {
						$('head').find('link.ace-ajax-stylesheet').remove();

						var main_selectors = ['link.ace-main-stylesheet', 'link#main-ace-style', 'link[href*="/ace.min.css"]', 'link[href*="/ace.css"]']
						var ace_style = [];
						for(var m = 0; m < main_selectors.length; m++) {
							ace_style = $('head').find(main_selectors[m]).first();
							if(ace_style.length > 0) break;
						}
						
						$contentArea.find('.ajax-append-link').each(function(e) {
							var $link = $(this);
							if ( $link.attr('href') ) {
								var new_link = jQuery('<link />', {type : 'text/css', rel: 'stylesheet', 'class': 'ace-ajax-stylesheet'})
								if( ace_style.length > 0 ) new_link.insertBefore(ace_style);
								else new_link.appendTo('head');
								new_link.attr('href', $link.attr('href'));//we set "href" after insertion, for IE to work
							}
							$link.remove();
						})
					}, 10);

					//////////////////////

					if(typeof self.settings.update_title === 'function') {
						self.settings.update_title.call(null, hash, url, link_text);
					}
					else if(self.settings.update_title === true) {
						updateTitle(link_text);
					}
					

					if( !manual_trigger ) {
						$('html,body').animate({scrollTop: 0}, 250);
					}
				}
				$contentArea.trigger('ajaxloadcomplete', {url: url, hash: hash});
				self.stopLoading(true);
			})
		}
		
		
		///////////////////////
		var fixPos = false;
		var loadTimer = null;
		this.startLoading = function() {
			if(working) return;
			working = true;
			
			if(!this.settings.loading_overlay && $contentArea.css('position') == 'static') {
				$contentArea.css('position', 'relative');//for correct icon positioning
				fixPos = true;
			}
				
			$overlay.remove();
			$overlay = $(this.settings.loading_html).css({height:($(document).height() - 110)});

			//if(this.settings.loading_overlay == 'body') $('body').append($overlay.addClass('ajax-overlay-body'));
			//else if(this.settings.loading_overlay) $(this.settings.loading_overlay).append($overlay);
			//else 
			$contentArea.append($overlay);

			
			if(this.settings.max_load_wait !== false) 
			 loadTimer = setTimeout(function() {
				loadTimer = null;
				if(!working) return;
				
				var event
				$contentArea.trigger(event = $.Event('ajaxloadlong'))
				if (event.isDefaultPrevented()) return;
				
				self.stopLoading(true);
			 }, this.settings.max_load_wait * 1000);
		}
		
		this.stopLoading = function(stopNow) {
			if(stopNow === true) {
				working = false;
				
				$overlay.remove();
				if(fixPos) {
					$contentArea.css('position', '');//restore previous 'position' value
					fixPos = false;
				}
				
				if(loadTimer != null) {
					clearTimeout(loadTimer);
					loadTimer = null;
				}
				
			}
			else {
				$overlay.addClass('almost-loaded');
				
				$contentArea.one('ajaxscriptsloaded.inner_call', function() {
					self.stopLoading(true);
					/**
					if(window.Pace && Pace.running == true) {
						Pace.off('done');
						Pace.once('done', function() { self.stopLoading(true) })
					}
					else self.stopLoading(true);
					*/
				})
			}
			
		}
		
		this.working = function() {
			return working;
		}
		///////////////////////
		 
		 function updateTitle(link_text) {
			var $title = $contentArea.find('.ajax-append-title');
			if($title.length > 0) {
				document.title = $title.text();
				$title.remove();
			}
			else if(link_text.length > 0) {
				var extra = $.trim(String(document.title).replace(/^(.*)[\-]/, ''));//for example like " - Ace Admin"
				if(extra) extra = ' - ' + extra;
				link_text = $.trim(link_text) + extra;
			}
		 }
		
		/////////////////
		$(window)
		.off('hashchange.menu_ajax')
		.on('hashchange.menu_ajax', function(e, manual_trigger) {
			
			var hash = $.trim(window.location.hash);
			if(!hash || hash.length == 0) return;
			
			self.loadUrl(hash);
		}).trigger('hashchange.menu_ajax', [true]);
		var hash = $.trim(window.location.hash);
		if(!hash && this.settings.default_url) window.location.hash = this.settings.default_url;

	}//ZmAjax



	$.fn.menu_ajax = function (option, value, value2, value3) {
		var method_call;

		var $set = this.each(function () {
			var $this = $(this);
			var data = $this.data('menu_ajax');
			var options = typeof option === 'object' && option;

			if (!data) $this.data('menu_ajax', (data = new ZmAjax(this, options)));
			if (typeof option === 'string' && typeof data[option] === 'function') {
				if(value3 != undefined) method_call = data[option](value, value2, value3);
				else if(value2 != undefined) method_call = data[option](value, value2);
				else method_call = data[option](value);
			}
		});

		return (method_call === undefined) ? $set : method_call;
	}
	
	$.fn.menu_ajax.defaults = {
		content_url: false,
		default_url: false,
		loading_html: '<div id="loadinggif"></div>',
		update_title: true,
		max_load_wait: false
     }

})(window.jQuery);