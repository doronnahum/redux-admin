import {message} from 'antd'

export const sendMessage = function(value, type = 'info', duration = 2.5) { message[type](value, duration) };
