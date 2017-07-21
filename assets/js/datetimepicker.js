/* jshint esversion: 6 */

/**
 * Yangholmes 2017-07-14
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
$.fn.datetimepicker = function(config){
  if( this[0].tagName !== 'INPUT' ) return false;
  if(!config) config={};
  config.bindObj = this;
  let dt = new Datetimepicker(config);

  this.on('touchstart', (e)=>{
    e.preventDefault();
    $(e.currentTarget).blur();
  }).on('touchend', (e)=>{
    dt.show();
  }).on('focusin', (e)=>{
    e.preventDefault();
    $(e.currentTarget).blur();
    dt.show();
  });
};


/**
 * Yangholmes 2017-07-07
 * @param  {[type]} initDt [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
var Datetimepicker = function (config) {
  if(!config) config = {};
  this.config = config;
  this.initDateTimePicker();
};
Datetimepicker.prototype = {
  /**
   * [constructor]
   * @type {[type]}
   */
  constructor: Datetimepicker,

  config: {},
  baseHeight: 16,
  onSelect: null, onChange: null,
  year: null, month: null, date: null, hour: null, minute: null,
  years: [], months: [], dates: [], hours: [], minutes: [],

  slots: {}, //  contains yearSlot, monthSlot, dateSlot, hourSlot, minuteSlot
  unitbar: '', picker: '', toolbar: '',
  thisDateTimePicker: {},
  unit: {
    cn: {
      'year': '年',
      'month': '月',
      'date': '日',
      'hour': '时',
      'minute': '分',
      'confirm': '确定',
      'cancel': '取消'
    },
    en: {
      'year': 'Year',
      'month': 'Month',
      'date': 'Date',
      'hour': 'Hour',
      'minute': 'Minute',
      'confirm': 'Sure',
      'cancel': 'Cancel'
    }
  },

  templatePicker: `
    <div class="picker">
      <div class="center-view"></div>
      <div class="slots"></div>
    </div>
  `,
  templateSlot: `
    <div class="slot"></div>
  `,
  templateUnit: `
    <div class="unit">
    </div>
  `,
  templateToolbar: `
    <div class="toolbar">
    </div>
  `,
  style: ".picker,.slot{margin:0 auto}.option,.toolbar div,.unit{line-height:1.5em}.mask{width:100%;height:100%;display:block;position:fixed;top:0;left:0;background:rgba(50,50,50,.7);z-index:999}.datetimepicker{display:none;position:fixed;width:80%;height:calc(1.5em * 6);left:10%;top:calc(30% - 3em * 1.5);z-index:1000;border-radius:3px;box-shadow:0 0 10px 2px}.unit{display:flex;justify-content:space-around;position:absolute;width:100%;height:1.5em;top:0;background:rgba(136,136,136,.8);z-index:999}.picker,.toolbar{position:absolute;background:#fff;width:100%}.picker{font-size:1em;display:block;height:7.5em;overflow:hidden}.center-view{display:block;position:absolute;border-top:1px solid rgba(200,200,200,1);border-bottom:1px solid rgba(200,200,200,1);width:100%;height:1.5em;top:3em}.slots{display:flex}.slot{display:inline-block;flex:1;height:100%;text-align:center;vertical-align:top;color:rgba(120,120,120,.5)}.option{display:block;font-size:1em}.option:after{content:'';position:absolute}.chosen{color:#000}.toolbar{display:flex;justify-content:space-around;top:calc(1.5em * 5 - 1px);box-sizing:border-box;border-top:1px solid rgba(120,120,120,.5)}.toolbar div{width:100%;text-align:center;background:rgba(255,255,255,0)}.picker,.unit{border-radius:3px 3px 0 0}.toolbar{border-radius:0 0 3px 3px}",

  /**
   * [initDateTimePicker description]
   * @param  {[type]} initDt [description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  initDateTimePicker: function () {
    this.initDt(this.config.initDt, this.generate);
    this.onSelect = this.config.onSelect ? this.config.onSelect : ()=>{};
    this.onChange = this.config.onChange ? this.config.onChange : ()=>{};
  },

  /**
   * initial Date
   * @param  {[type]} initDt [description]
   * @return {[type]}        [description]
   */
  initDt: function (initDt, callback) {
    if(!initDt)
      initDt = new Date();
    else
      initDt = new Date(initDt);
    this.year = initDt.getFullYear();
    this.month = initDt.getMonth() + 1;
    this.date = initDt.getDate();
    this.hour = initDt.getHours();
    this.minute = initDt.getMinutes();

    callback.call(this);
  },

  generate: function () {

    this.generateStyle();

    this.generateYears(this.year);
    this.generateMonths(this.month);
    this.generateDates(this.date);
    this.generateHours(this.hour);
    this.generateMinutes(this.minute);

    this.generatePicker();
    // this.generateUnitbar();
    this.generateToolbar();

    this.render();
  },

  generateYears: function (year) {
    let years = [], range = 20;
    years[range] = year;
    for(let i=1;i<range+1;i++){
      years[range-i] = year - i;
      years[range+i] = year + i;
    }
    this.years = years;
    this.generateSlot(this.years, range, 'year');
    return this.years;
  },

  generateMonths: function (month) {
    for(let i=0;i<12;i++){
      this.months[i] = i+1;
    }
    this.generateSlot(this.months, this.month-1, 'month');
    return this.months;
  },

  generateDates: function (date) {
    this.dates = [];
    let dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
    if( [1,3,5,7,8,10,12].indexOf(this.month) !== -1 ){
      // this.dates.push(...dates,29,30,31);
      this.dates = dates.concat([29, 30, 31]);
    }
    else if( this.month !== 2 ){
    this.dates = dates.concat([29, 30]);
    }
    else if( (this.year%100!=0&&this.year%4==0) || (this.year%100==0&&this.year%400==0) ){
      // this.dates.push(...dates,29);
      this.dates = dates.concat([29]);
    }
    else{
      this.dates = dates;
    }
    this.generateSlot(this.dates, this.date-1, 'date');
    return this.dates;
  },

  generateHours: function (hour) {
    for(let i=0;i<24;i++){
      this.hours[i] = i;
    }
    this.generateSlot(this.hours, this.hour, 'hour');
    return this.hours;
  },

  generateMinutes: function (minute) {
    for(let i=0;i<60;i++){
      this.minutes[i] = i;
    }
    this.generateSlot(this.minutes, this.minute, 'minute');
    return this.minutes;
  },

  generateSlot: function (datas, defaultIndex, slotClass) {
    let options = [],
        offset = (2 - defaultIndex) * this.baseHeight * 1.5;
    if( datas.length === 0 ) return false;
    for(let i=0;i<datas.length;i++){
      options[i] = ( $('<div>').addClass('option'+(i==defaultIndex?' chosen':'')).html(datas[i]));
    }
    // this[slotClass+'Slot'] = $(this.templateSlot).addClass(slotClass).css('transform', 'translateY('+offset+'px)').append(options);
    this.slots[slotClass] = $(this.templateSlot).addClass(slotClass).css('transform', 'translateY('+offset+'px)').append(options);
    return this.addSlotEventListener(this.slots[slotClass]);
  },

  generateStyle: function () {
    if( !$('.datetimepicker-style').length )
      $('<style>').addClass('datetimepicker-style').html(this.style).appendTo('head');
    switch (this.config.size) {
      case 'regular':
        this.baseHeight = 20;
        break;
      case 'small':
        this.baseHeight = 16;
        break;
      case 'big':
        this.baseHeight = 24;
        break;
      default:
        this.baseHeight = 20;
        break;
    }
  },

  generatePicker: function () {
    let picker = $(this.templatePicker).attr( 'id', this.config.id ),
        slots = picker.find('.slots'),
        lang = this.config.lang ? this.config.lang : 'cn',
        unitbar = $(this.templateUnit);
    if(this.config.timepicker === false && this.config.datepicker !== false){
      slots.append([this.slots.year, this.slots.month, this.slots.date]);
      unitbar.append( ['year', 'month', 'date'].map((e)=>{return '<div class="'+e+'">'+this.unit[lang][e]+'</div>';}) );
    }
    else if(this.config.datepicker === false && this.config.timepicker !== false){
      slots.append([this.slots.hour, this.slots.minute]);
      unitbar.append( ['hour', 'minute'].map((e)=>{return '<div class="'+e+'">'+this.unit[lang][e]+'</div>';}) );
    }
    else{
      slots.append([this.slots.year, this.slots.month, this.slots.date, this.slots.hour, this.slots.minute]);
      unitbar.append( ['year', 'month', 'date', 'hour', 'minute'].map((e)=>{return '<div class="'+e+'">'+this.unit[lang][e]+'</div>';}) );
    }
    this.picker = picker;
    this.unitbar = unitbar;
    return this.picker;
  },

  // generateUnitbar: function () {},

  generateToolbar: function () {
    let lang = this.config.lang ? this.config.lang : 'cn',
        toolbar = $(this.templateToolbar);
    toolbar.append( ['confirm', 'cancel'].map((e)=>{return '<div class="'+e+'">'+this.unit[lang][e]+'</div>';}) );
    this.addToolbarEventListener(toolbar);
    this.toolbar = toolbar;
    return this.toolbar;
  },

  render: function () {
    this.thisDateTimePicker = $('<div>').addClass('datetimepicker').css('font-size', this.baseHeight+'px').append(this.unitbar, this.picker, this.toolbar).appendTo($('body'));
  },

  addSlotEventListener: function (slot) {
    let moveEnable = false,
        position1, position2, positionNow, deltaY, chosen, slotHeight,
        that = this;

    slot
    .on('touchstart', function (e) {
      moveEnable = true;
      position1 = e.changedTouches[0].clientY;
      slotHeight = parseInt( $(this).css('height') );
      positionNow = parseInt( $(this).css('transform').match(/, *(-?\d+)\)$/)[1] );
      $(this).find('.option').removeClass('chosen');
    })
    .on('touchend', function (e) {
      moveEnable = false;
      chosen = (position2/1.5/that.baseHeight).toFixed();
      if( chosen>2 ) chosen = 2;
      else if( chosen<0-slotHeight/1.5/that.baseHeight+3 ) chosen = 0-slotHeight/1.5/that.baseHeight+3;
      $(this).css('transform', 'translateY(' + chosen*1.5*that.baseHeight + 'px)');

      chosen = parseInt(chosen);
      let index = 2-chosen;
      $(this).find('.option').eq(index).addClass( "chosen" );

      that.updateSlot(e);
    })
    .on('touchmove', function (e) {
      e.preventDefault();
      if(!moveEnable) return false;
      deltaY = e.changedTouches[0].clientY - position1;
      position2 = deltaY + positionNow;
      $(this).css('transform', 'translateY(' + position2 + 'px)');
    });

    return slot;
  },

  addToolbarEventListener: function (toolbar) {
    toolbar.find('.cancel').on('touchstart', (e)=>{
      $(e.currentTarget).css('background', 'rgba(136, 136, 136, 0.8)');
    }).on('touchend', (e)=>{
      $(e.currentTarget).css('background', 'none');
      this.close();
    });
    toolbar.find('.confirm').on('touchstart', (e)=>{
      $(e.currentTarget).css('background', 'rgba(136, 136, 136, 0.8)');
    }).on('touchend', (e)=>{
      $(e.currentTarget).css('background', 'none');
      this.select();
    });
  },

  updateSlot: function (e) {
    let slot = e.currentTarget,
        chosen = $(slot).find('.chosen'),
        className = slot.className.replace('slot ', '');
    this[className] = parseInt( chosen.html() );

    if( className === 'month' || className === 'year' ){
      if(this.date === 31 && [4,6,9,11].indexOf(this.month) !== -1){
        this.date = 30;
      }
      else if(this.date >= 29 && this.month === 2){
        this.date = 28;
      }
      this.generateDates();
      this.thisDateTimePicker.find('.slot.date').replaceWith(this.slots.date);
    }

    this.onChange();
  },

  show: function () {
    // $('.datetimepicker').fadeIn(400);
    if( !$('body .mask').length )
      $('<div>').addClass('mask').appendTo( $('body') );
    $('body .mask').show();
    this.thisDateTimePicker.fadeIn(400);
  },

  close: function () {
    // $('.datetimepicker').fadeOut(400, ()=>{ $('.datetimepicker').remove(); });
    // $('body .mask').hide();
    this.thisDateTimePicker.fadeOut(400, ()=>{$('body .mask').hide()});
  },

  select: function () {
    let format = this.config.format ? this.config.format : 'Y/M/d H:i',
        dt = '';
    dt = format.replace('Y', this.year).replace('M', this.month).replace('d', this.date).replace('H', this.hour).replace('i', this.minute);

    this.config.bindObj.val(dt);
    this.close();
    this.onSelect(dt);
  }

};
