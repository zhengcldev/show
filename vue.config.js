let proxyObj={}

proxyObj['/']={
	//websorcket
	ws:false,
	//目标地址
	target:'http://localhost:8864',
	//发送请求的请求头变为host
	changeOrigin:true,
	pathReWrite:{
		'^/':'/'
	}
}
module.exports = {
	devServer: {
		disableHostCheck: false,
		host: 'localhost',
		port: 8848,
		https: false,
		hotOnly: false,
		proxy: proxyObj
	},
	lintOnSave:false,
};
