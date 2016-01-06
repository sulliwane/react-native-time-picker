var React = require('react-native');
var {
  View,
  Text,
  ListView,
  Animated,
  StyleSheet,
  Dimensions,
  ListView,
  Animated,
  TouchableOpacity,
} = React;
var moment = require('moment');
var SCREEN_WIDTH = Dimensions.get('window').width;
var SCREEN_HEIGHT = Dimensions.get('window').height;
var MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul',
  'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
var getDaysInMonth = function(month, year) {
  var lastDayOfMonth = new Date(year, month + 1, 0);
  return lastDayOfMonth.getDate();
};

var ItemsPicker = React.createClass({
  getInitialState:function(){
    return ({
    });
  },
  _setItem:function(rowdata){
    this.props.setItem(rowdata);
  },
  _renderHeader:function(){
    return <View style={{height : SCREEN_HEIGHT / 4 - 50}}></View>;
  },
  _renderFooter:function(){
    return <View style={{height : SCREEN_HEIGHT / 4 - 50}}></View>;
  },
  _renderRow:function(rowdata){
    var rowStyle = this.props.currentItem === rowdata ? {color:'black',transform:[{scale:1.3}]} : {color:'gray'};
    return (
      <TouchableOpacity onPress={this._setItem.bind(this,rowdata)}>
        <View style={styles.rowItem}>
          <Text style={[rowStyle,{fontSize:20}]}>{rowdata}</Text>
        </View>
      </TouchableOpacity>
    );
  },
  render:function() {
    var ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }).cloneWithRows(this.props.dataSource);
    return (
      <ListView
        ref="listView"
        initialListSize={1}
        dataSource={ds}
        renderRow={this._renderRow}
        renderHeader={this._renderHeader}
        renderFooter={this._renderFooter}
        showsVerticalScrollIndicator={false}/>
    );
  }
});
var DatePicker = React.createClass({
  PropTypes:{
    onCancel: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    maxYear: React.PropTypes.number,
    minYear: React.PropTypes.number,
  },
  getInitialState:function(){
    this._years = [];
    //TODO detect types
    var _maxYear = this.props.maxYear ? this.props.maxYear : moment().get('year') - 15;
    var _minYear = this.props.minYear ? this.props.minYear : (_maxYear - 50);
    for (var i = _maxYear,j = 0; i > _minYear; i--,j++) {
      this._years[j] = i;
    }
    return {
      year: 1985 ,
      month: 'Jan',
      day: 1,
      days: 31,
    };
  },
  _cancel:function(){
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  _confirm:function(){
    console.log('Date=' + this.state.year + this.state.month + this.state.day);
    var birthday = {
        year: this.state.year,
        month: this.state.month,
        day: this.state.day,
       };
    this.props.onConfirm(birthday);
    this._cancel();
  },
  _setYear:function(year){
    var days = getDaysInMonth(MONTHS.indexOf(this.state.month),year);
    this.setState({
      year,
      days,
      day:this.state.day > days ? days : this.state.day,
    });
  },
  _setMonth:function(month){
    var days = getDaysInMonth(MONTHS.indexOf(month),this.state.year);
    this.setState({
      month,
      days,
      day:this.state.day > days ? days : this.state.day,
    });
  },
  _setDay:function(day){
    this.setState({day});
  },
  render: function() {
    var days = [];
    for (var i = 1; i <= this.state.days; i++) {
      days[i - 1] = i;
    }
    return (
      <View style={styles.container}>
        <View style={{height:SCREEN_HEIGHT * 0.5 - 40}}></View>
        <View style={{flex:1}}>
          <View style={styles.selectContainer}>
            <TouchableOpacity onPress={this._cancel}>
              <View style={[styles.buttonContainer,{alignItems:'flex-start'}]}>
                <Text style={[styles.buttonText,{marginLeft:20}]}>Cancel</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._confirm}>
              <View style={[styles.buttonContainer,{alignItems:'flex-end'}]}>
                <Text style={[styles.buttonText,{marginRight:20}]}>Ok</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.datePicker} >
            <ItemsPicker
              setItem={this._setYear}
              currentItem={this.state.year}
              dataSource={this._years}/>
            <ItemsPicker
              setItem={this._setMonth}
              currentItem={this.state.month}
              dataSource={MONTHS}/>
            <ItemsPicker
              currentItem={this.state.day}
              dataSource={days}
              setItem={this._setDay}/>
          </View>
        </View>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  container: {
    position:'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderTopColor: 'transparent',
    borderWidth: 1,
    height: 40,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    width: SCREEN_WIDTH / 2,
  },
  buttonText: {
    fontSize: 25,
    color: 'grey',
  },
  datePicker: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT / 2,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  rowItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin:5,
  },
});

module.exports = DatePicker;
