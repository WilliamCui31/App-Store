const recomReducer = {
  // recommendation列表
  recomList: (state = { status: 'empty', list: [] }, action) => {
    switch (action.type) {
      case 'getRecomList':
        return Object.assign({}, state, { status: 'loading' });
      case 'getRecomListSuccess':
        return Object.assign({}, state, {
          status: 'success',
          list: action.payload.feed.entry
        });
      case 'getRecomListFailure':
        return Object.assign({}, state, {
          status: 'failure',
          msg: action.payload.msg
        });
      default:
        return state;
    }
  }
};

export default recomReducer;