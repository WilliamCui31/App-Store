import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import request from '../../utils/request';
import { FadeLoader } from 'react-spinners';
import styles from './app-list.less';

class AppList extends PureComponent {
  constructor(props) {
    super(props);
    this.props.getAppList();
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //变量windowHeight是可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    const { keywords, showList, searchList } = this.props;
    const { status, page } = keywords ? searchList : showList;
    //滚动条到底部的条件
    if (
      scrollTop + windowHeight === scrollHeight &&
      (status === 'success' || status === 'failure') &&
      page < 10
    ) {
      //加载相应页码的数据
      keywords ? this.loadSearchList(page + 1) : this.loadShowList(page + 1);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { appList, keywords, clearSearchList } = this.props;
    if (prevProps.appList.status === 'loading' && appList.status === 'success') {
      this.loadShowList(1);
    }
    if (keywords && prevProps.keywords !== keywords) {
      clearSearchList();
      this.loadSearchList(1);
    }
  }

  // 根据搜索关键字分页加载评分等级和评论数量
  loadSearchList = page => {
    const { keywords, appList, updateAppList, loadSearchList, loadSearchListSuccess } = this.props;
    loadSearchList();
    const startIndex = 10 * (page - 1);
    const endIndex = 10 * (page - 1) + 10;
    const searchAllList = appList.list.filter(item => {
      const name = item['im:name'].label;
      const category = item.category.attributes.label;
      const summary = item.summary.label;
      const reg = new RegExp(keywords);
      return reg.test(name) || reg.test(category) || reg.test(summary);
    }); // 搜尋列表
    let pageList = searchAllList.slice(startIndex, endIndex); // 分頁列表
    const loadList = pageList.filter(item => {
      return item.averageUserRating === undefined;
    }); // 需要加載的列表
    const promises = loadList.map(item => {
      return request.get(`/hk/lookup?id=${item.id.attributes['im:id']}`);
    }); // 加載請求數組
    Promise.all(promises)
      .then(lookupArr => {
        const list = loadList.map((item, index) => {
          const { userRatingCount = 0, averageUserRating = 0 } = lookupArr[index].results[0] || {};
          return { ...item, userRatingCount, averageUserRating };
        });
        appList.list = appList.list.map(item => {
          list.find(loadItem => {
            if (item.id.attributes['im:id'] === loadItem.id.attributes['im:id']) {
              item = loadItem;
              return true;
            }
            return false;
          });
          return item;
        });
        pageList = pageList.map(item => {
          list.find(loadItem => {
            if (item.id.attributes['im:id'] === loadItem.id.attributes['im:id']) {
              item = loadItem;
              return true;
            }
            return false;
          });
          return item;
        });
        updateAppList(appList);
        loadSearchListSuccess({ page, list: pageList });
      })
      .catch(error => {
        this.loadSearchList(page);
      });
  };

  // 分页加载评分等级和评论数量
  loadShowList = page => {
    const { appList, updateAppList, loadShowList, loadShowListSuccess } = this.props;
    loadShowList();
    const startIndex = 10 * (page - 1);
    const endIndex = 10 * (page - 1) + 10;
    const pageList = appList.list.slice(startIndex, endIndex); //分页列表
    const loadList = pageList.filter(item => item.averageUserRating === undefined); // 需要加载的列表
    const promises = loadList.map(item => {
      return request.get(`/hk/lookup?id=${item.id.attributes['im:id']}`);
    }); // 加载列表请求数组
    Promise.all(promises)
      .then(lookupArr => {
        const list = loadList.map((item, index) => {
          const { userRatingCount = 0, averageUserRating = 0 } = lookupArr[index].results[0] || {};
          return { ...item, userRatingCount, averageUserRating };
        });
        appList.list = appList.list.map(item => {
          list.find(loadItem => {
            if (item.id.attributes['im:id'] === loadItem.id.attributes['im:id']) {
              item = loadItem;
              return true;
            }
            return false;
          });
          return item;
        });
        updateAppList(appList);
        loadShowListSuccess({ page, list: appList.list.slice(startIndex, endIndex) });
      })
      .catch(error => {
        this.loadShowList(page);
      });
  };

  render() {
    const { appList, keywords, showList, searchList, viewport } = this.props;
    const { status, list } = keywords ? searchList : showList;
    let searchAllList = [];
    if (keywords) {
      searchAllList = appList.list.filter(item => {
        const name = item['im:name'].label;
        const category = item.category.attributes.label;
        const summary = item.summary.label;
        const reg = new RegExp(keywords);
        return reg.test(name) || reg.test(category) || reg.test(summary);
      });
    }

    return (
      <>
        <ul className={styles.list}>
          {list.map((item, index) => {
            return (
              <li key={item.id.attributes['im:id']}>
                <div className={styles.number}>{index + 1}</div>
                <div className={`${styles.img} ${index % 2 !== 0 ? ` ${styles.even}` : ''}`}>
                  <img src={item['im:image'][viewport.dpr > 1 ? 2 : 1].label} alt="app-img" />
                </div>
                <div className={styles.info}>
                  <h5 className={styles.name}>{item['im:name'].label}</h5>
                  <h6 className={styles.category}>{item.category.attributes.label}</h6>
                  <span className={styles.level}>
                    {Array(5)
                      .fill(0)
                      .map((_, index) => (
                        <i
                          key={index}
                          className={`iconfont ${
                            index + 1 <= item.averageUserRating * 1 ? 'icon-star-full' : 'icon-star'
                          }`}
                        ></i>
                      ))}
                    <em>({item.userRatingCount})</em>
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        {(status === 'empty' || status === 'loading') && (
          <div className={styles.loading}>
            <FadeLoader />
          </div>
        )}
        {list.length === 100 && (
          <div className={styles.bottomLine}>
            <span>我是有底线的</span>
          </div>
        )}
        {keywords && searchAllList.length > 0 && list.length === searchAllList.length && (
          <div className={styles.bottomLine}>
            <span>沒有更多了</span>
          </div>
        )}
        {status === 'success' && list.length === 0 && (
          <div className={styles.empty}>
            <i className="iconfont icon-empty"></i>
            <div className={styles.tip}>抱歉，没有找到相关应用！</div>
          </div>
        )}
      </>
    );
  }
}

//映射state到容器组件props
const mapStateToProps = state => ({
  appList: state.appList,
  showList: state.showList,
  keywords: state.keywords,
  searchList: state.searchList
});

//映射dispatch到容器组件props
const mapDispatchToProps = dispatch => ({
  lookUp: payload => dispatch({ type: 'lookUp', payload }),
  getAppList: payload => dispatch({ type: 'getAppList', payload }),
  updateAppList: payload => dispatch({ type: 'updateApplist', payload }),
  loadShowList: payload => dispatch({ type: 'loadShowList', payload }),
  loadShowListSuccess: payload => dispatch({ type: 'loadShowListSuccess', payload }),
  loadSearchList: payload => dispatch({ type: 'loadSearchList', payload }),
  loadSearchListSuccess: payload => dispatch({ type: 'loadSearchListSuccess', payload }),
  clearSearchList: payload => dispatch({ type: 'clearSearchList', payload })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppList);
