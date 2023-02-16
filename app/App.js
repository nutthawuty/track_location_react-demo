import React, {Component} from "react";
import { Switch } from "react-native";
import { StyleSheet,SafeAreaView,View,Text,Button, Alert, } from "react-native";
import * as Location from 'expo-location';
import TrackLocation from './components/Location';
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            timerID: null,
            locationSubscrition: null,
            isEnabled: false,
            latitude: '',
            longitude: '',
            ErrorMsg: ''
        };
    }
    toggleSwitch = (switchOn) => {
        this.setState((state, props) => ({
            isEnabled: switchOn
        }));
        console.log('--> toggle switch', switchOn);
        if (switchOn === true) {
            this.watchLocation();
        } else {
            this.locationSubscrition.remove();
        }
    };

    tick () {
        this.setState({
            date: new Date()
        })
    }
    componentDidMount () {
        this.timerID = setInterval(() => {
            this.tick();
        }, 1000);
    }
    componentWillUnmount () {
        clearInterval(this.timerID);
    }

    createTwoButtonAlert = () =>
        Alert.alert('Alert Title', 'My Alert Msg', [
        {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
    ]);
    watchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        this.setState({
            ErrorMsg: 'Permission to access location was denied'
        });
        return;
      } else {
        this.locationSubscrition = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                distanceInterval: 10,
            },
            location => {
                console.log(location);
                this.setState({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });
            }
        )
        // // Asks the user to turn on high accuracy location mode which enables network provider that uses Google Play services to improve location accuracy and location-based services
        // Location.enableNetworkProviderAsync();
      }
    };
    render () {
        return (
            <SafeAreaView style={styles.container}>
                {/* <View style={styles.grid}>
                    <View style={styles.item}>
                        {this.state.ErrorMsg}
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.text}>{this.state.date.toLocaleTimeString()}</Text>
                    </View>
                    <View style={styles.item}>
                        <Text style={styles.text}>{this.state.latitude}, {this.state.longitude}</Text>
                    </View>
                </View>
                <View>
                    <Switch 
                        trackColor={{false: '#767577', true: '#309704'}}
                        value={this.state.isEnabled} onValueChange={isSwitchOn => this.toggleSwitch(isSwitchOn)} />
                </View> */}
                <TrackLocation />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        fontWeight: "bold"
    },
    divColmn: {
        flexDirection: "column"
    },
    grid: {
        padding: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
        width: '100%' // is 50% of container width
    },  
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default App