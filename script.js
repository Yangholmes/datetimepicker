/* jshint esversion: 6 */
$(function () {

  $('input#1').datetimepicker({
    initDt: '1900-01-01',
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

  $('input#3').datetimepicker({

  });

  $('input#4').datetimepicker({
    timepicker: false,
    format: 'Y-M-d'
  });

  $('input#5').datetimepicker({
    datepicker: false,
    format: 'H:i'
  });

  $('input#6').datetimepicker({
      lang: 'en'
  });

  $('input#7').datetimepicker({
      format: 'Y年M月d日H时i分'
  });
});
