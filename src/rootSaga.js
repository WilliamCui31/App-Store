import { takeEvery, call, put } from 'redux-saga/effects';
import listSaga from './components/AppList/saga';
import recomSage from './components/Recommendation/saga';
// import searchSage from './components/SearchBar/saga';
import request from './utils/request';

//键值对转换为字符串
function params(data) {
  let arr = [];
  Object.keys(data).forEach((key, index) => {
    arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
  });
  return arr.join('&');
}

// 根据action.type执行异步请求(sage)
function executeSaga(action) {
  return function*({ path }) {
    if (action.payload) {
      path += '?' + params(action.payload);
    }
    //定义请求者
    const requester = () => request.get(`/hk${path}`);
    try {
      //调用请求者获取数据
      const json = yield call(requester);

      //dispatch一个action到reducer更新state
      yield put({
        type: `${action.type}${json ? 'Success' : 'Failure'}`,
        payload: json
      });
    } catch (error) {}
  };
}

const sagas = Object.assign(
  {},
  listSaga,
  recomSage,
  // searchSage
);
function* rootSaga() {
  for (let key in sagas) {
    yield takeEvery(key, action => executeSaga(action)(sagas[key]));
  }
}

export default rootSaga;
