module.exports = {
  webSite: {
    port: '885'
  },
  nodeServer: {
    target: "http://localhost:886",
    port: '886',
    //登录接口配置
    loginConfig: {
      host: "test.tronker.com",
      port: "80",
      appKey: "100001",
      method: "user.login",
      version: "1.0",
      format: "json",
      loginType: "3",
      secret: "a4160d00-b083-40f9-a749-07aef8782001"
    },
    //资源接口配置
    apiConfig: {
      host: "test5.tronker.com",
      port: "80",
      apiBasePath: "/api/mall/v1.0/" //接口前缀
    },
    OSSUploadApiPath: 'http://test5.tronker.com/api/mall/v1.0/file/uploadImage'//后台上传路径
  },
  sessionStore: {
    host: '127.0.0.1',
    port: '6379'
  }


}