/**
 * Created by gan on 2017/12/6.
 */
import Vue from 'vue';

Vue.component('t-more', {
  render: function (createElement) {
    return createElement(
      'div',
      {
        'style':{
          'text-align': 'center',
          'height': '50px',
          'margin-top': '-50px'
        },
        'attrs':{
          'slot':'top'
        }
      },
      [createElement('p',{
        'style':{
          'color': '#CCCCCC',
          'margin-bottom': '8px',
          'padding-top': '8px'
        },
        'domProps': {
          'innerHTML': '没有更多了'
        },
      }),createElement('img',{
        'attrs':{
          'src':'./static/images/logo.png'
        },
        'style':{
          'width': '37px'
        },
      })]
    )
  },
});

Vue.component('b-more', {
  render: function (createElement) {
    return createElement(
      'div',
      {
        'style':{
          'text-align': 'center',
          'height': '50px',
          'margin-top': '-50px'
        },
        'attrs':{
          'slot':'top'
        }
      },
      [createElement('img',{
        'attrs':{
          'src':'./static/images/logo.png'
        },
        'style':{
          'width': '37px'
        },
      }),createElement('p',{
        'style':{
          'color': '#CCCCCC',
          'margin-bottom': '8px',
          'padding-top': '8px'
        },
        'domProps': {
          'innerHTML': '没有更多了'
        },
      })]
    )
  },
});
