const listReducer = {
  // top100 app数据
  appList: (state = { status: 'empty', list: [] }, action) => {
    switch (action.type) {
      case 'getAppList':
        return Object.assign({}, state, { status: 'loading' });
      case 'getAppListSuccess':
        return Object.assign({}, state, {
          status: 'success',
          list: action.payload.feed.entry
        });
      case 'getAppListFailure':
        return Object.assign({}, state, {
          status: 'failure',
          msg: action.payload.msg
        });
      default:
        return state;
    }
  },

  // 當前顯示app列表
  showList: (state = { status: 'empty', page: 0, list: [] }, action) => {
    switch (action.type) {
      case 'loadShowList':
        return Object.assign({}, state, { status: 'loading' });
      case 'loadShowListSuccess':
        return Object.assign({}, state, {
          status: 'success',
          page: action.payload.page,
          list: [...state.list, ...action.payload.list]
        });
      case 'loadShowListFailure':
        return Object.assign({}, state, {
          status: 'failure',
          msg: action.payload.msg
        });
      default:
        return state;
    }
  },

  // 當前顯示app列表
  searchList: (state = { status: 'empty', page: 0, list: [] }, action) => {
    switch (action.type) {
      case 'loadSearchList':
        return Object.assign({}, state, { status: 'loading' });
      case 'loadSearchListSuccess':
        return Object.assign({}, state, {
          status: 'success',
          page: action.payload.page,
          list: [...state.list, ...action.payload.list]
        });
      case 'loadSearchListFailure':
        return Object.assign({}, state, {
          status: 'failure',
          msg: action.payload.msg
        });
      case 'clearSearchList':
        return { status: 'empty', page: 0, list: [] };
      default:
        return state;
    }
  }
};

export default listReducer;
