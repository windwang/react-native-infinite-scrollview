import React, {
  Component,
  View,
  ScrollView,
} from 'react-native';

export default class InfiniteScrollView extends Component {
  constructor(props) {
    super(props);

    var fromIndex = props.fromIndex || Number.NEGATIVE_INFINITY;
    var toIndex = props.toIndex || Number.POSITIVE_INFINITY;

    var index = 0;
    if(this.props.index) index = Math.min(Math.max(this.props.index, fromIndex), toIndex);
    else index = Math.max(0, fromIndex);

    this._scrollView = null;
    this._offscreenPages = this.props.offScreenPages || 1;
    this._renderedRange = {};
    this.state = {
      index: index,
      fromIndex: fromIndex,
      toIndex: toIndex,
      size: {
        width: 0,
        height: 0,
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var range = this._pagesRange(nextState);
    return (
      nextState.size !== this.state.size ||  
      range.to !== this._renderedRange.to || range.from !== this._renderedRange.from
    );
  }
  componentDidUpdate() {
    var scrollTo = {animated: false}
    if(this.props.horizontal) scrollTo.x = (this.state.index - this._renderedRange.from) * this.state.size.width;
    else scrollTo.y = (this.state.index - this._renderedRange.from) * this.state.size.height;
    this._scrollView.scrollTo(scrollTo);    
  }
  render() {
    var pages = null;
    if(this.state.size.width > 0 && this.state.size.width > 0) {
      var range = this._pagesRange(this.state);
      pages = this._createPages(range);  
    }
    return (
      <View style={this.props.style} onLayout={(event) => this._layoutChanged(event)}>
        <ScrollView 
          style={{overflow: 'visible'}}
          ref={(scrollView) => { this._scrollView = scrollView; }}
          horizontal={this.props.horizontal}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          onMomentumScrollEnd={(e) => this._scrollEnded(e)}>
          {pages}
        </ScrollView>
      </View>
    );
  }
  _layoutChanged(event) {
    var {x, y, width, height} = event.nativeEvent.layout;

    this.setState({
      size: {
        width: width,
        height: height
      }
    });
  }
  _pagesRange(state) {
    var range = {};
    range.from = Math.max(state.index - this._offscreenPages, state.fromIndex);
    range.to = Math.min(range.from + 2 * this._offscreenPages, state.toIndex);
    range.from = Math.min(range.from, range.to - 2 * this._offscreenPages);
    return range;
  }
  _createPages(range) {
    var pages = [];
    for(i = range.from; i <= range.to; i++) {
      pages.push(this._renderPage(i));
    }
    this._renderedRange = range;
    return pages;
  }
  _renderPage(index) {
    return (
      <View style={{width: this.state.size.width, height: this.state.size.height}} key={index}>
        {this.props.renderPage(index)}
      </View>
    );
  }
  _scrollEnded(event) {
    var scrollIndex = Math.round(this.props.horizontal ? event.nativeEvent.contentOffset.x / this.state.size.width : event.nativeEvent.contentOffset.y / this.state.size.height);
    var index = this.state.index + scrollIndex - Math.min(this._offscreenPages, this.state.index - this.state.fromIndex) - Math.max(0, this._offscreenPages + this.state.index - this.state.toIndex); 
    this.setState({index: index});
  }
}