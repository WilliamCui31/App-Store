const searchReducer = {
  // top100 app数据
  keywords: (state = '', action) => {
    switch (action.type) {
      case 'inputKeywords':
        return action.payload;
      case 'clearKeywords':
        return '';
      default:
        return state;
    }
  }
};

export default searchReducer;
