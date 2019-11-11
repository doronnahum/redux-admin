import PropTypes from 'prop-types';

export const antdFormItem = {
  colon: PropTypes.bool,
  required: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  help: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  labelCol: PropTypes.objectOf({ span: PropTypes.string, offset: PropTypes.string }),
  wrapperCol: PropTypes.objectOf({ span: PropTypes.string, offset: PropTypes.string }),
};

export const antdTextInput = {
  type: PropTypes.string, // The type of input, see: MDN(use Input.TextArea instead of type="textarea")	string	text
  autoFocus: PropTypes.bool, // get focus when component mounted	boolean	false
  disabled: PropTypes.bool, // Whether the input is disabled.	boolean	false
  size: PropTypes.oneOf(['small', 'large ']), // The size of the input box. Note: in the context of a form, the large size is used. Available: large default small	string	default
  prefix: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The prefix icon for the Input.	string|ReactNode
  suffix: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The suffix icon for the Input. string|ReactNode
  addonAfter: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The label text displayed after (on the right side of) the input field.	string|ReactNode
  addonBefore: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The label text displayed before (on the left side of) the input field.	string|ReactNode
  onPressEnter: PropTypes.func, // The callback function that is triggered when Enter key is pressed.	function(e)
};
export const antdNumberInput = {
  autoFocus: PropTypes.bool, // get focus when component mounted	boolean	false
  disabled: PropTypes.bool, // disable the input	boolean	false
  size: PropTypes.string, // width of input box	string
  formatter: PropTypes.string, // Specifies the format of the value presented	function(value: number | string): string	-
  max: PropTypes.number, // max	max value	number	Infinity
  min: PropTypes.number, // min	min value	number	-Infinity
  decimalSeparator: PropTypes.string, // decimal separator	string	-
  parser: PropTypes.func, // Specifies the value extracted from formatter function( string): number
  step: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // The number to which the current value is increased or decreased. It can be an integer or decimal.	number|string	1
};


export const antdDatePicker = {
  onOk: PropTypes.func, // callback when click ok button	function()
  renderExtraFooter: PropTypes.func, // render extra footer in panel	() => React.ReactNode	-
  onCalendarChange: PropTypes.func, // a callback function, can be executed when the start time or the end time of the range is changing	function(dates: moment, moment, dateStrings: string, string)	无
  suffixIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The suffix icon for the Input. string|ReactNode
  size: PropTypes.string, // width of input box	string
  format: PropTypes.string, // to set the date format, refer to moment.js	string	"YYYY-MM-DD"
  showTime: PropTypes.bool, // to provide an additional time selection	object|boolean	TimePicker Options
  showToday: PropTypes.bool, // to provide an additional time selection	object|boolean	TimePicker Options
  allowClear: PropTypes.bool, // Whether to show clear button	boolean	true
  defaultValue: PropTypes.any, // to set default date	moment	-
  autoFocus: PropTypes.bool, // get focus when component mounted	boolean	false
  disabled: PropTypes.bool, // disable the input	boolean	false
};
export const antdTimePicker = {
  onOk: PropTypes.func, // callback when click ok button	function()
  suffixIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // The suffix icon for the Input. string|ReactNode
  size: PropTypes.string, // width of input box	string
  format: PropTypes.string, // to set the date format, refer to moment.js	string	"YYYY-MM-DD"
  defaultValue: PropTypes.any, // to set default date	moment	-
  allowEmpty: PropTypes.bool, // Whether to show clear button	boolean	true
  autoFocus: PropTypes.bool, // get focus when component mounted	boolean	false
  disabled: PropTypes.bool, // disable the input	boolean	false
};

export const antdSearchInput = {
  enterButton: PropTypes.bool, // For search input
  onSearch: PropTypes.func,
};
export const antdTextAreaInput = {
  autosize: PropTypes.bool,
};
export const formikField = {
  name: PropTypes.string.isRequired,
};
