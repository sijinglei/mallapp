import Vue from "vue";
import Router from "vue-router";
import { Toast } from "mint-ui";
import com from "@/api/common";
import LeiRouter from "./lei";
import GanRouter from "./gan";
import Home from "@/views/Home";
import Login from "@/views/Login";
import UserIndex from "@/views/user/Index";
import Lease from "@/views/user/lease";
import OrderList from "@/views/user/orderList";
import OrderDetail from '@/views/user/relevant/order-detail';
import Coupon2 from "@/views/user/coupon2";
import Address from "@/views/user/address";
import Help from "@/views/user/Help";
import Service from "@/views/user/service";
import Setting from "@/views/user/setting";
import AddAddress from '@/views/user/relevant/add-address';
import OrderTracking from '@/views/user/relevant/order-tracking';
import LeaseDetail from '@/views/user/relevant/lease-detail';


Vue.use(Router);
var routeArr = [{
    path: "/",
    redirect: "/Login"
},
{
    path: "/home",
    name: "Home",
    component: Home
},
{
    path: "/login",
    name: "Login",
    component: Login
},
{
    path: "/userIndex",
    name: "UserIndex",
    component: UserIndex
},
{
    path: "/lease",
    name: "lease",
    meta: { requireLogin: true },
    component: Lease
},
{
    path: "/leasedetail",
    name: "leasedetail",
    meta: { requireLogin: true },
    component: LeaseDetail
},
{
    path: "/orderlist/:orderType/:status",
    name: "OrderList", //租赁订单
    meta: { requireLogin: true },
    component: OrderList
},
{
    path: "/orderdetail",
    name: "OrderDetail",
    meta: { requireLogin: true },
    component: OrderDetail
},
{
    path: "/coupon2",
    name: "coupon-wts", //梧桐树优惠卷
    meta: { requireLogin: true },
    component: Coupon2
},
{
    path: "/address",
    name: "Address",
    meta: { requireLogin: true },
    component: Address
},
{
    path: "/addaddress",
    name: "addAddress", //编辑收货地址
    meta: { requireLogin: true },
    component: AddAddress
},
{
    path: '/ordertracking',
    name: 'orderTracking',
    meta: { requireLogin: true },
    component: OrderTracking
},
{
    path: "/Help",
    name: "help",
    meta: { requireLogin: true },
    component: Help
},
{
    path: "/service",
    name: "service",
    meta: { requireLogin: true },
    component: Service
},
{
    path: "/setting",
    name: "setting",
    meta: { requireLogin: true },
    component: Setting
}
];
const router = new Router({
    hashbang: false,
    routes: [...routeArr, ...LeiRouter, ...GanRouter]
});
// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    // console.log(to);
    if (to.matched.some(res => res.meta.requireLogin)) {
        console.log("需要验证登陆");
        // 判断是否需要登录权限
        if (com.getCookie('username') && com.getSession("loginUserBaseInfo")) {
            // 判断是否登录
            console.log("已经登陆");
            next();
        } else {
            // 没登录则跳转到登录界面
            next({
                path: "/Login",
                query: { redirect: to.fullPath } //登陆成功可以调回去的页面地址
            });
        }
    } else {
        next();
    }
});

export default router;
