import React, { PureComponent } from 'react';
import SearchBar from './components/SearchBar';
import Recommendation from './components/Recommendation';
import AppList from './components/AppList';
import styles from './App.less';
import { debounce } from './utils';

class App extends PureComponent {
  // 视口尺寸和设备像素比，用于响应式布局
  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      dpr: window.devicePixelRatio
    }
  };

  // 更新viewport
  updateViewport = debounce(() => {
    this.setState({
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio
      }
    });
  }, 500);

  componentDidMount() {
    window.addEventListener('resize', this.updateViewport);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateViewport);
  }

  render() {
    const { viewport } = this.state;
    return (
      <div className={styles.app}>
        <SearchBar></SearchBar>
        <Recommendation viewport={viewport}></Recommendation>
        <AppList viewport={viewport}></AppList>
      </div>
    );
  }
}

export default App;
