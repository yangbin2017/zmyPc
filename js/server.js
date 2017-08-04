;
(function ($) {
    var appServer = function () {
    };
    appServer.prototype = {
        login: function (loginInfo, callBack) {
            $.eosgi.service.execute('sys.memberService.login', loginInfo, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        qryCompanyList: function (token, callBack) {
            $.eosgi.service.execute('company.staffService.qryManagerCompanyList', {
                loginToken: localStorage.getItem("loginToken"),
                appId: "1"
            }, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        setCompany: function (companyId, callBack) {
            $.eosgi.service.execute('company.staffService.setCurrentCompany', {
                companyId: companyId
            }, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        qryMenuList: function (callBack) {
            $.eosgi.service.execute('company.staffService.qryMenuList', {
                loginToken: localStorage.getItem("loginToken")
            }, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        setLoginPwd: function (pwdInfo, callBack) {
            $.eosgi.service.execute('sys.memberService.setLoginPwd', pwdInfo, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        qryCompanyModuleList: function (option, callBack) {
            $.eosgi.service.execute('company.companyService.qryCompanyModuleList', {
                loginToken: localStorage.getItem("loginToken")
            }, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        //员工列表
        getStaffHomePage: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.getStaffHomePage',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        goShopAddStaff: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.goShopAddStaff',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        addMemberStaffUser: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.addMemberStaffUser',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        updateStaffStateById: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.updateStaffStateById',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        upateStoreStaff: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.upateStoreStaff',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
        goUpdateStaff: function (option, callBack) {
            $.eosgi.service.execute('company.staffService.goUpdateStaff',option, function (json) {
                if (json.flag) {
                    callBack(json)
                }
            })
        },
    }
    $.appServer = new appServer()
})(jQuery)