
import Cars from "@/views/Cars";
import chose from '@/components/cars/car-chose'
var RouterGan = [
  {
    path: "/cars",
    name: "cars",
    component: Cars,
    children:[{
      name:'carschose',
      path:'chose',
      component:chose
    }]
  },];
export default RouterGan;
