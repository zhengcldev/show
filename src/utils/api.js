import axios from "axios";
import {
	Message
} from 'element-ui';
import router from '../router';

//请求拦截器
// axios.interceptors.request.use(config=>{
// 	if(window.sessionStorage.getItem('userId')){
//
// 	}
// });

//响应拦截器
axios.interceptors.response.use(success => {
	//业务逻辑
	if (success.status && success.status === 200) {
		if (success.code === 500 || success.code === 401) {
			Message.error({
				message: success.data.message
			});
			
			return;
		}
	}
	return success;
}, error => {
	if (error.response.code === 404) {
		Message.error({
			message: '服务器被吃了！'
		});
	} else if (error.response.code === 403) {
		Message.error({
			message: '权限不足！'
		});
	} else if (error.response.code === 401) {
		Message.error({
			message: '尚未登陆！'
		});
		router.replace('/login');
	} else {
		if (error.response.message) {
			Message.error({
				message: error.response.message
			});
		} else {
			Message.error({
				message: '未知错误！'
			});
		}
	}
});

let base = '';// eslint-disable-line no-unused-vars
//json格式post
export const postRequest = (url, params) => {
	return axios({
		headers: {
			'Content-Type': 'application/json'
		},
		method: 'post',
		url: base+url,
		data: params
	})
};

export const getRequest = (url, params) => {
	return axios({
		method: 'get',
		url: base+url,
		params: params
	})
};

export const putRequest = (url, params) => {
	return axios({
		method: 'put',
		url: base+url,
		data: params
	})
};

export const deleteRequest = (url, params) => {
	return axios({
		method: 'delete',
		url: base+url,
		data: params
	})
};
