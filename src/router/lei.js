import Coupon from "@/views/user/coupon";
import Productlist from "@/views/Productlist";
import Category from "@/views/Category";
import HelpCenter from "@/views/Help/HelpCenter";
import HelpList from "@/views/Help/HelpList";
import HelpDetail from "@/views/Help/HelpDetail";

var RouterLei = [
  {
    path: "/coupon",
    name: "coupon", //我的优惠券
    component: Coupon
  },
  {
    path: "/category",
    name: "Category",
    component: Category
  },
  {
    path: "/productlist",
    name: "productlist", //商品列表
    component: Productlist
  },
  {
    path: "/helpcenter",
    name: "helpcenter", //帮助中心
    component: HelpCenter
  },
  {
    path: "/helplist",
    name: "helplist", //帮助列表
    component: HelpList
  },
  {
    path: "/helpDetail",
    name: "helpDetail", //帮助详细
    component: HelpDetail
  },
];
export default RouterLei;
