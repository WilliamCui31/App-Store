import axios from 'axios';

/**
 * @author William Cui
 * @description 自定义配置请求axios实例
 * @return Promise 对象
 * @date 2019-09-19
 **/
const request = axios.create({
  timeout: 1000 * 5,
  headers: { 'Content-Type': 'application/json' }
});

// Override timeout default for the library
// Now all requests using this instance will wait 2.5 seconds before timing out

request.interceptors.response.use(
  function(response) {
    if (response.status === 200) {
      return response.data;
    } else {
    }
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

export default request;
