import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { FadeLoader } from 'react-spinners';
import styles from './recommendation.less';

class Recommendation extends PureComponent {
  constructor(props) {
    super(props);
    this.props.getRecomList();
  }

  componentDidUpdate() {
    if (this.props.recomList.status === 'failure') {
      this.props.getRecomList();
    }
  }

  render() {
    const { keywords, recomList, viewport } = this.props;
    let { status, list } = recomList;
    if (keywords) {
      list = list.filter(item => {
        const name = item['im:name'].label;
        const category = item.category.attributes.label;
        const summary = item.summary.label;
        const reg = new RegExp(keywords);
        return reg.test(name) || reg.test(category) || reg.test(summary);
      });
    }

    return (
      <section className={styles.recom}>
        <h3>推介</h3>
        <div className={styles.wrapper}>
          <ul className={styles.list}>
            {list.map(item => {
              return (
                <li key={item.id.attributes['im:id']}>
                  <div className={styles.img}>
                    <img src={item['im:image'][viewport.width > 320 ? 2 : 1].label} alt="app-img" />
                  </div>
                  <h5 className={styles.name}>{item['im:name'].label}</h5>
                  <h6 className={styles.category}>{item.category.attributes.label}</h6>
                </li>
              );
            })}
          </ul>
          {(status === 'empty' || status === 'loading') && (
            <div className={styles.loading}>
              <FadeLoader />
            </div>
          )}
          {status === 'success' && list.length === 0 && (
            <div className={styles.empty}>
              <i className="iconfont icon-empty"></i>
              <div className={styles.tip}>抱歉，没有找到相关应用！</div>
            </div>
          )}
        </div>
      </section>
    );
  }
}

//映射state到容器组件props
const mapStateToProps = state => ({
  keywords: state.keywords,
  recomList: state.recomList
});

//映射dispatch到容器组件props
const mapDispatchToProps = dispatch => ({
  getRecomList: payload => dispatch({ type: 'getRecomList', payload })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Recommendation);
