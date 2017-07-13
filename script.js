/* jshint esversion: 6 */
$(function () {

  $('input#1').datetimepicker({
    initDt: null,
    format: 'H:i',
    id: 'test',
    lang: 'cn',
    size: 'small',
    onSelect: function (dt) {
      console.log(dt);
    }
  });

  $('input#2').datetimepicker({
    size: 'big',
  });

  $('input#3').datetimepicker();


});
