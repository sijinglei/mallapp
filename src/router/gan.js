
import Cars from "@/views/Cars";
import Detail from "@/views/product/detail";
import Chose from '@/components/cars/car-chose'
import Fillin from '@/views/product/fill-in'
var RouterGan = [
  //购物车
  {
    path: "/cars",
    name: "cars",
    component: Cars,
    children:[{
      name:'carschose',
      path:'chose',
      component:Chose
    }]
  },
  //产品详情
  {
    path:'/product/detail/:id',
    name:'detail',
    component:Detail
  },
  //提交订单
  {
    path:'/product/fill',
    name:'productfill',
    component:Fillin
  }
];
export default RouterGan;
