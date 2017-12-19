import Coupon from "@/views/user/coupon";
import Productlist from "@/views/CateGory/Productlist";
import Category from "@/views/CateGory/Category";
import HelpCenter from "@/views/Help/HelpCenter";
import HelpList from "@/views/Help/HelpList";
import HelpDetail from "@/views/Help/HelpDetail";
import MessageCenter from "@/views/Message/MessageCenter";
import ServiceInfo from "@/views/Message/ServiceInfo";
import SystemInfo from "@/views/Message/SystemInfo";
import InfoDetail from "@/views/Message/InfoDetail";
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
    path: "/helpetail",
    name: "helpetail", //帮助详细
    component: HelpDetail
  },
  {
    path: "/messagecenter",
    name: "messagecenter", //消息中心
    component: MessageCenter
  },
  {
    path: "/serviceinfo",
    name: "serviceinfo", //服务消息
    component: ServiceInfo
  },
  {
    path: "/systeminfo",
    name: "systeminfo", //系统消息
    component: SystemInfo
  },
  {
    path: "/infodetail",
    name: "infodetail", //消息详情
    component: InfoDetail
  },
];
export default RouterLei;
