import React, {
  Component,
  View,
  ScrollView,
} from 'react-native';

export default class InfiniteScrollView extends Component {
  constructor(props) {
    super(props);
    this._scrollView = null;
    this._offscreenPages = this.props.offScreenPages || 1;
    this.state = {
      index: 0,
      size: {
        width: 0,
        height: 0,
      }
    }
  }
  render() {
    var pages = this._createPages();  
    var contentOffset = {x:0,y:0};
    if(this.props.horizontal) contentOffset.x = this._offscreenPages * this.state.size.width;
    else contentOffset.y = this._offscreenPages * this.state.size.height;  
  	return (
      <View style={this.props.style} onLayout={(event) => this._layoutChanged(event)}>
        <ScrollView 
          ref={(scrollView) => { this._scrollView = scrollView; }}
          horizontal={this.props.horizontal}
          automaticallyAdjustContentInsets={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}
          contentOffset={contentOffset}
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
    })
  }
  _createPages() {
    var pages = [];
    var numberOfPages = this._offscreenPages * 2 + 1;
    for(i = 0; i < numberOfPages; i ++) {
      pages.push(this._renderPage(i + this.state.index - this._offscreenPages));
    }
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
    var index = this.state.index + scrollIndex - this._offscreenPages; 
    this._positionPages(index);
  }
  _positionPages(index) {
    var scrollTo = {animated: false}
    if(this.props.horizontal) scrollTo.x = this._offscreenPages * this.state.size.width;
    else scrollTo.y = this._offscreenPages * this.state.size.height;

    this._scrollView.scrollTo(scrollTo);    
    this.setState({index: index});
  }
}