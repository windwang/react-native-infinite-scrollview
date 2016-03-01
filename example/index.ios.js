'use strict';

import App from './app';

import React, {
  AppRegistry,
  Component,
} from 'react-native';

class InfiniteScrollViewExample extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('InfiniteScrollViewExample', () => InfiniteScrollViewExample);
