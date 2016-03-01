import InfiniteScrollView from 'react-native-infinite-scrollview';

import moment from 'moment';
import React, {
  Component,
  StyleSheet,
  View,
  Text,
} from 'react-native';


export default class App extends Component {
  render() {
  	return (
  		<View style={styles.container}>
  			<InfiniteScrollView style={styles.scrollview} horizontal={true} offScreenPages={1} renderPage={(index) => this._renderPage(index)}/>
  		</View>
  	);
  }
  _renderPage(index) {
    var date = moment().add(index, 'days');
    return (
      <View style={styles.page} key={index}>
        <Text style={styles.dayname}>{date.format('dddd')}</Text>
        <Text style={styles.day}>{date.format('D')}</Text>
        <Text style={styles.month}>{date.format('MMMM')}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#FCFCFC',
  },
  scrollview: {
  	flex: 1,
    backgroundColor: '#031634',
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#E8DDCB',
    borderRadius: 20,
  },
  dayname: {
    fontSize: 25,
    color: '#036564',
  },
  day: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#033649',
  },
  month: {
    fontSize: 25,
    color: '#036564',
  }
});