/**
 * Created by gan on 2017/11/24.
 */

var util={
  loadding(vm,a){
    /**
     *
     * param
     * vm => vue对象
     * a => Boole
     * */
    a?vm.$store.commit('LOADDING_SHOW'):vm.$store.commit('LOADDING_HIDE');
  }
};
export default util
