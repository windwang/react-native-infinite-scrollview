	 import React, { Component } from 'react';
  import { View,ScrollView } from 'react-native';


export default class InfiniteScrollView extends Component {
  constructor(props) {
    super(props);
    this._scrollView = null;
    this._offscreenPages = this.props.offScreenPages || 1;
    this._renderedRange = {};
    this.state = {
      size: {
        width: 0,
        height: 0,
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    var range = this._pagesRange(nextProps);
    return (
      nextState.size !== this.state.size ||  
      range.to !== this._renderedRange.to || range.from !== this._renderedRange.from ||
      this._index(nextProps) !== this._index()
    );
  }
  componentDidUpdate() {
    var scrollTo = {animated: false}
    if(this.props.horizontal) scrollTo.x = (this._index() - this._renderedRange.from) * this.state.size.width;
    else scrollTo.y = (this._index() - this._renderedRange.from) * this.state.size.height;
    this._scrollView.scrollTo(scrollTo);    
  }
  render() {
    var pages = null;
    if(this.state.size.width > 0 && this.state.size.width > 0) {
      var range = this._pagesRange();
      pages = this._createPages(range);  
    }
    return (
      <ScrollView 
        {...this.props}
        ref={(scrollView) => {this._scrollView = scrollView}}
        onLayout={(e) => this._layoutChanged(e)}
        pagingEnabled={true}
        onMomentumScrollEnd={(e) => this._onMomentumScrollEnd(e)}>
        {pages}
      </ScrollView>
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
    if(this.props.onLayout) {
      this.props.onLayout(event);
    }
  }
  _onMomentumScrollEnd(event) {
    var scrollIndex = Math.round(this.props.horizontal ? event.nativeEvent.contentOffset.x / this.state.size.width : event.nativeEvent.contentOffset.y / this.state.size.height);
    var currentIndex = this._index();
    var index = currentIndex + scrollIndex - Math.min(this._offscreenPages, currentIndex - this._fromIndex()) - Math.max(0, this._offscreenPages + currentIndex - this._toIndex()); 

    if(index !== currentIndex && this.props.onPageIndexChange) {
      this.props.onPageIndexChange(index);
    }

    this.setState({index: index});

    if(this.props.onMomentumScrollEnd) {
      this.props.onMomentumScrollEnd(event);
    }
  }
  _pagesRange(props) {
    var range = {};
    range.from = Math.max(this._index(props) - this._offscreenPages, this._fromIndex(props));
    range.to = Math.min(range.from + 2 * this._offscreenPages, this._toIndex(props));
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
  _fromIndex(props) {
    if(!props) props = this.props;
    var fromIndex = Number.NEGATIVE_INFINITY;
    if(props.fromIndex % 1 === 0) fromIndex = props.fromIndex;
    return fromIndex;
  }

  _toIndex(props) {
    if(!props) props = this.props;
    var toIndex = Number.POSITIVE_INFINITY;
    if(props.toIndex % 1 === 0) toIndex = props.toIndex;
    return toIndex;
  }

  _index(props) {
    if(!props) props = this.props;
    var index = 0;
    if(props.index % 1 === 0) index = Math.min(Math.max(props.index, this._fromIndex(props)), this._toIndex(props));
    else index = Math.max(0, _this._fromIndex(props));
    return index;
  }
}