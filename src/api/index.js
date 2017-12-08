module.exports = {
    get: "/api/get",
    post: "/api/post",
    account: {
        login: "/api/account/loginIn",
        register: "account/register",
        getmobilecode: "user/mobilecode"
    },
    area: {
        list: "area/getlist" //获取区域下拉框 (省/市/县区)
    },
    //商品
    goods: {
        index: "index", //首页接口
        catlist: "goodsCat/list", //商品类目
        goodlistbycatid: "/goods/getListByCatId", //商城类目商品列表
        goodinfobyid: "goods/getInfoByGoodsId", //商品详情
        productinfobyid: "goods/getInfoByProductId", //产品详情
        productlist: "/goods/getProductList" //商城产品列表
    },
    //品牌
    brand: {
        list: "/brand/list" //品牌列表
    },
    //购物车
    cart: {
        testmy: "http://easy-mock.com/mock/5a1bada19144e669fc6e37a8/mall/cars#!method=get",
        my: "cart/my", //我的购物车
        count: "cart/count", //购物车总数
        add: "cart/add", //添加购物车
        edit: "cart/edit", //编辑购物车
        addbatch: "cart/addBatch", //批量添加购物车
        delete: "/cart/delete", //删除购物车
        change: "/cart/change" //重选购物车
    },
    //订单
    order: {
        add: "order/add", //下单
        preadd: "/order/preAdd", //下单页面数据
        leaselist: "order/leaseList", //用户租赁详情列表
        leaserepay: "order/leaseRepay", //订单待还详情
        wechatpay: "/order/weixinPay", //订单微信支付
        cancel: "/order/cancel", //取消订单
        expire: "/order/expire", //订单支付超时时间
        receive: "/order/receive", //确认收货
        amount: "order/amount" //订单及优惠券数量统计
    },
    //租赁
    cert: {
        save: "certification/saveRentca", //租赁认证 rentIdentityType:(0 学生，1 职员，2 集团)
        getrentcainfo: "certification/getRentcaInfo" //个人租赁认证信息查询
    },
    //个人中心
    member: {
        orderlist: "member/order/list", //个人订单列表
        orderdetail: "member/order/detail", //个人订单详情
        addresslist: "member/address/list", //获取用户收货地址列表
        addressdetail: "member/address/detail", //用户收货地址详情
        addaddress: "member/address/save", //新增收货地址
        addressdelete: "member/address/delete" //收货地址删除
    },
    //首页
    home: {
        index: "index",
        testindex: "http://easy-mock.com/mock/5a1bada19144e669fc6e37a8/mall/index#!method=get"
    },
    my: {
        logincount: "index/log", //用户登录次数记录
        logincoupon: "/coupon/loginCoupon", //登录赠送优惠券
        couponlist: "/coupon/my", //我的优惠券
        messageunread: "message/unread", //未读消息数量统计
        messagelist: "message/list", //个人消息列表
        messagedetail: "message/detail", //消息详情
        removeallmsg: "message/removeall", //清空当前消息列表
        logistics: "express/detail", //物流查询
        helpcenter: "help/message/list", //帮助中心
        helpdetail: "help/message/detail", //帮助中心详情
        agreements: "agreement/detail" //租赁协议信息
    },
    upload: {
        certfileupload: "file/uploadImage" //租赁认证图片上传
    }
};
