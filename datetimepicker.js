/* jshint esversion: 6 */
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
  year: null, month: null, date: null, hour: null, minute: null,
  years: [], months: [], dates: [], hours: [], minutes: [],
  yearSlot: '', monthSlot: '', dateSlot: '', hourSlot: '', minuteSlot: '',
  picker: '',
  unit: {
    cn: {
      'year': '年',
      'month': '月',
      'date': '日',
      'hour': '时',
      'minute': '分'
    }
  },

  templatePicker: `
    <div class="picker">
      <div class="center-view"></div>
    </div>
  `,
  templateSlot: `
    <div class="slot"></div>
  `,
  templateUnit: `
    <div class="unit">
      <div class="year">年</div>
      <div class="month">月</div>
      <div class="date">日</div>
      <div class="hour">时</div>
      <div class="minute">分</div>
    </div>
  `,
  templateToolbar: `
    <div class="button-group">
      <div>取消</div>
      <div>确定</div>
    </div>
  `,
  style: ``,

  /**
   * [initDateTimePicker description]
   * @param  {[type]} initDt [description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  initDateTimePicker: function () {
    this.initDt(this.config.initDt, this.generate);
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
    this.generateYears(this.year);
    this.generateMonths(this.month);
    this.generateDates(this.date);
    this.generateHours(this.hour);
    this.generateMinutes(this.minute);

    this.generatePicker();

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
      this.dates.push(...dates,29,30,31);
    }
    else if( this.month !== 2 ){
      this.dates.push(...dates,29,30);
    }
    else if( (this.year%100!=0&&this.year%4==0) || (this.year%100==0&&this.year%400==0) ){
      this.dates.push(...dates,29);
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

  generateSlot: function (option, defaultIndex, slotClass) {
    if( option.length === 0 ) return false;
    for(let i=0;i<option.length;i++){
      option[i] = ( $('<div>').addClass('option'+(i==defaultIndex?' chosen':'')).html(option[i]));
    }
    let offset = (2 - defaultIndex) * 16 * 1.5;
    this[slotClass+'Slot'] = $(this.templateSlot).addClass(slotClass).css('transform', 'translateY('+offset+'px)').append(option);
    return this[slotClass+'Slot'];
  },

  generatePicker: function () {
    let picker = $(this.templatePicker).attr( 'id', this.config.id );
    if(this.config.timepicker === false && this.config.datepicker !== false){
      picker.append([this.yearSlot, this.monthSlot, this.dateSlot]);
    }
    else if(this.config.datepicker === false && this.config.timepicker !== false){
      picker.append([this.hourSlot, this.minuteSlot]);
    }
    else{
      picker.append([this.yearSlot, this.monthSlot, this.dateSlot, this.hourSlot, this.minuteSlot]);
    }
    this.picker = picker;
    return this.picker;
  },

  render: function () {
    $('<div>').addClass('datetimepicker').append(this.templateUnit, this.picker, this.templateToolbar).appendTo($('body'));

    this.addEventListener();
  },

  addEventListener: function () {

  },

  close: function () {

  },

  select: function () {

  }

};
