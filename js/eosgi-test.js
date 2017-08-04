(function ($, window) {
    'use strict';

    /* Check jquery */
    if (typeof($) === 'undefined') throw new Error('Eosgi requires jQuery');

    // ZUI shared object
    if (!$.eosgi) $.eosgi = function (obj) {
        if ($.isPlainObject(obj)) {
            $.extend($.eosgi, obj);
        }
    };

    var lastUuidAmend = 0;
    $.eosgi({
        uuid: function () {
            return (new Date()).getTime() * 1000 + (lastUuidAmend++) % 1000;
        },

        callEvent: function (func, event, proxy) {
            if ($.isFunction(func)) {
                if (proxy !== undefined) {
                    func = $.proxy(func, proxy);
                }
                var result = func(event);
                if (event) event.result = result;
                return !(result !== undefined && (!result));
            }
            return 1;
        },

        clientLang: function () {
            var lang;
            var config = window.config;
            if (typeof(config) != 'undefined' && config.clientLang) {
                lang = config.clientLang;
            } else {
                var hl = $('html').attr('lang');
                lang = hl ? hl : (navigator.userLanguage || navigator.userLanguage || 'zh_cn');
            }
            return lang.replace('-', '_').toLowerCase();
        }
    });

    $.fn.callEvent = function (name, event, model) {
        var $this = $(this);
        var dotIndex = name.indexOf('.eosgi.');
        var shortName = name;
        if (dotIndex < 0 && model && model.name) {
            name += '.' + model.name;
        } else {
            shortName = name.substring(0, dotIndex);
        }
        var e = $.Event(name, event);

        if ((model === undefined) && dotIndex > 0) {
            model = $this.data(name.substring(dotIndex + 1));
        }

        if (model && model.options) {
            var func = model.options[shortName];
            if ($.isFunction(func)) {
                $.eosgi.callEvent(model.options[shortName], e, model);
            }
        }
        return e;
    };
}($, window));


(function ($) {
    'use strict';
    //var initServer=['a.service.lrsh.com:80','b.service.lrsh.com:80','c.service.lrsh.com:81'],
    //var initServer=['192.168.31.49:8081'],324324
    var initServer = ['192.168.31.178:8081'],
        isEncode = true,
        callHost = '',
        initServerIndex = 0,
        isDevelop = true,
        version = '1.0.0';
    var Service = function () {

    };
    Service.prototype.setMode = function (value) {
        localStorage['mode'] = value;
    };
    Service.prototype.getMode = function () {
        var mode = 'issue';
        return mode;
    };
    /* Save page data */
    Service.prototype.setValidServer = function (value) {
        localStorage['validServer'] = value;
    };
    Service.prototype.getValidServer = function () {
        var validServer = localStorage['validServer'];
        return validServer;
    };
    Service.prototype.getExecuteServiceUrl = function () {
        return "http://" + this.getValidServer() + "/common/service.execute.json";
    };
    Service.prototype.getBathExecuteServiceUrl = function (value) {
        return "http://" + this.getValidServer() + "/common/service.bathExecute.json";
    };
    Service.prototype.init = function (onInitFunction) {
        this.setValidServer(initServer[initServerIndex]);
        if (isDevelop) {
            onInitFunction();
        } else {
            this.initValidServer(onInitFunction);
        }
    };
    Service.prototype.initValidServer = function (onInitFunction) {
        //uexWindow.toast(1,5,"正在寻找最优服务器，请等待！",0);
        this.execute("eosgi.server.getValidServer", {}, function (data, status) {
            //timeout,success,error
            if (status == "success") {
                //uexWindow.closeToast();
                // alert(JSON.stringify(data))
                if (data.flag) {
                    $.eosgi.service.setValidServer(data.validServer);
                    onInitFunction();
                } else {
                    //uexWindow.alert("异常提示","服务器异常 ！请联系懒人生活，电话：400-6600-580。",['确定']);
                }
            } else if (status == "timeout" || status == "error") {
                if (initServerIndex < initServer.length - 1) {
                    initServerIndex++;
                    $.eosgi.service.setValidServer(initServer[initServerIndex]);
                    $.eosgi.service.initValidServer(onInitFunction);
                } else {
                    //uexWindow.closeToast();
                    //uexWindow.confirm("异常提示","网络异常，是否重试！",['是','退出懒人生活']);
                    /*
                     uexWindow.cbConfirm=function(opId,dataType,data){
                     if(data==0){
                     eosgi.service.initServerIndex=0;
                     eosgi.service.initValidServer(onInitFunction);
                     }else{
                     uexWidgetOne.exit();
                     }
                     }*/
                }

            }
        });
    };


    Service.prototype.ajax = function (url, param, callFunction) {
        var token = localStorage.getItem('loginToken');
        if (token) {
            param.loginToken = token;
        }
        /*
         var newParam = {};
         if(isEncode){
         for (var i in param) {
         newParam[$.eosgi.util.encode64(i)]=$.eosgi.util.encode64(param[i]);
         }
         }else{
         newParam=param;
         }
         */
        $.ajax({
            url: url,
            type: "post",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "jsonp",
            timeout: "10000",
            data: param,
            success: function (data) {
                console.log(data)
                callFunction(data, "success");


                /*
                 //alert(JSON.stringify(data));
                 if (!isDevelop) {
                 if (data.validServer != undefined) {
                 $.eosgi.service.setValidServer(data.validServer);
                 }
                 }
                 if(data.isServiceUpgrade){
                 //uexWindow.closeToast();
                 //uexWindow.alert("升级提示","服务器正在升级中，请在"+data.serviceUpgradeDateTime+"后使用！",['确定']);
                 }else{
                 callFunction(data,"success");
                 }
                 //uexWindow.closeToast();
                 */
            },
            error: function (XMLHttpRequest, status) {
                //status还有 timeout,success,error等值的情况
                callFunction(null, status)
            }
        });

    };

    Service.prototype.bathExecute = function (callArray, callFun) {
        var postParams = {};
        postParams._mode = this.getMode();
        postParams._callArray = callArray;
        postParams._version = version;
        this.ajax(this.getBathExecuteServiceUrl(), postParams, callFun);
    };

    Service.prototype.execute = function (service, params, callFun) {
        var paramsStr = "";
        if (params instanceof Object) {
            paramsStr = JSON.stringify(params);
        } else {
            paramsStr = params;
        }
        var postParams = {};
        postParams._mode = this.getMode();
        postParams._call = service;
        postParams._params = paramsStr;
        postParams._version = version;
        this.ajax(this.getExecuteServiceUrl(), postParams, callFun);
    };

    $.eosgi({
        service: new Service()
    });
}($));


$.eosgi.service.init(function () {
    //alert('a');
});
/*
 var data = {
 'advertAreaId': '1'
 };
 $.eosgi.service.execute('shop.shopService.qryAdvertList', data, function(json) {
 alert(JSON.stringify(json));
 })
 */
