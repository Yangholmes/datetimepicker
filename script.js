/* jshint esversion: 6 */
$(()=>{

  /*let moveEnable = false,
      position1, position2, positionNow, deltaY, chosen, slotHeight;

  $('.slot')
  .on('touchstart', function (e) {
    moveEnable = true;
    position1 = e.changedTouches[0].clientY;
    slotHeight = parseInt( $(this).css('height') );
    positionNow = parseInt( $(this).css('transform').match(/, *(-?\d+)\)$/)[1] );
    $(this).find('.option').removeClass('chosen');
  })
  .on('touchend', function (e) {
    moveEnable = false;
    chosen = (position2/1.5/16).toFixed();
    if( chosen>2 ) chosen = 2;
    else if( chosen<0-slotHeight/1.5/16+3 ) chosen = 0-slotHeight/1.5/16+3;
    $(this).css('transform', 'translateY(' + chosen*1.5*16 + 'px)');

    chosen = parseInt(chosen);
    console.log(chosen);
    let index = 2-chosen;
    $(this).find('.option').eq(index).addClass( "chosen" );
  })
  .on('touchmove', function (e) {
    e.preventDefault();
    if(!moveEnable) return false;
    deltaY = e.changedTouches[0].clientY - position1;
    position2 = deltaY + positionNow;
    $(this).css('transform', 'translateY(' + position2 + 'px)');
  });*/
});

$.fn.datetimepicker = function(){
  if( this[0].tagName !== 'INPUT' ) return false;
   dt = new Datetimepicker({
    initDt: null,
    datepicker: true,
    format: 'M/d/Y',
    id: 'test',
    lang: 'en',
    onSelect: (dt)=>{
      console.log(dt);
    }
  });
};

$('input').datetimepicker();
