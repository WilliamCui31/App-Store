import React, { useState } from 'react';
import { connect } from 'react-redux';
import { throttle } from '../../utils';
import styles from './search-bar.less';

const SearchBar = ({ inputKeywords, clearKeywords }) => {
  const searchInput = React.createRef();
  const [isFoucs, setIsFocus] = useState(false);
  function handleClick() {
    searchInput.current.focus();
  }

  // 节流搜索
  const handleSearch = throttle(() => {
    inputKeywords(searchInput.current.value.trim() || '');
  }, 500);

  return (
    <header className={styles.searchBar}>
      <input
        type="text"
        ref={searchInput}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleSearch}
      />
      <span
        className={`${styles.label}${isFoucs ? ` ${styles.isFoucs}` : ''}`}
        onClick={handleClick}
      >
        <i className="iconfont icon-search"></i>搜尋
      </span>
    </header>
  );
};

//映射state到容器组件props
const mapStateToProps = state => ({
  keywords: state.keywords
});

//映射dispatch到容器组件props
const mapDispatchToProps = dispatch => ({
  inputKeywords: payload => dispatch({ type: 'inputKeywords', payload }),
  clearKeywords: payload => dispatch({ type: 'clearKeywords', payload })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
