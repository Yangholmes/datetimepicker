/* jshint esversion: 6 */
$(()=>{
  
});

$.fn.datetimepicker = function(){
  if( this[0].tagName !== 'INPUT' ) return false;
   dt = new Datetimepicker({
    initDt: null,
    datepicker: false,
    format: 'M/d/Y',
    id: 'test',
    lang: 'en',
    onSelect: (dt)=>{
      console.log(dt);
    }
  });
};

$('input').datetimepicker();
