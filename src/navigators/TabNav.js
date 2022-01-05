import React from 'react';
import {Image, Platform, View, Text, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {Icons, Colors, Fonts} from '../themes/Themes';
import {translate} from '../utils/helpers/i18n';
import normalize from '../utils/helpers/normalize';

import Policy from '../screens/main/Policy';
import Profile from '../screens/main/Profile';
import Messages from '../screens/main/Messages';
import PolicyOverview from '../screens/main/PolicyOverview';

import {useSelector} from 'react-redux';

function TabUI({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options;
  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderTopColor: '#DADADA',
        borderTopWidth: normalize(1),
        paddingBottom: Platform.OS == 'ios' ? normalize(15) : normalize(5),
      }}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        let tabImage = '';
        let showDot = false;
        let routeName = null;

        switch (route.name) {
          case 'PolicyOverview':
            tabImage = Icons.policy;
            routeName = 'Policy';
            if (navigation.dangerouslyGetState().index == 0) {
              showDot = true;
              tabImage = Icons.policy_Fill;
            }
            break;
          case 'Messages':
            tabImage = Icons.messages;
            if (navigation.dangerouslyGetState().index == 1) {
              showDot = true;
              tabImage = Icons.messages_Fill;
            }
            break;
          case 'Profile':
            tabImage = Icons.profile;
            if (navigation.dangerouslyGetState().index == 2) {
              showDot = true;
              tabImage = Icons.profile_fill;
            }
            break;
          default:
            break;
        }

        return tabImage != '' ? (
          <TouchableOpacity key={index} onPress={onPress} style={{flex: 1}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop:
                  Platform.OS === 'ios' ? normalize(10) : normalize(10),
              }}>
              <Image
                source={tabImage}
                style={{
                  height: normalize(25),
                  width: normalize(25),
                  marginVertical: normalize(2),
                  marginBottom: normalize(4),
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: showDot == true ? Colors.black : Colors.lightBlack,
                  fontSize: normalize(13),
                  fontFamily: Fonts.Montserrat_SemiBold,
                }}>
                {translate(routeName || route.name)}
              </Text>
            </View>
          </TouchableOpacity>
        ) : null;
      })}
    </View>
  );
}

export default function TabNav(props) {
  const PolicyReducer = useSelector(state => state.PolicyReducer);
  const Tab = createBottomTabNavigator();

  return (
    <SafeAreaProvider>
      <Tab.Navigator
        initialRouteName={
          PolicyReducer?.buyedPolicyList &&
          Array.isArray(PolicyReducer?.buyedPolicyList)
            ? 'PolicyOverview'
            : 'Policy'
        }
        tabBar={props => <TabUI {...props} />}
        lazy={true}>
        <Tab.Screen name="PolicyOverview" component={PolicyOverview} />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen
          name="Profile"
          component={Profile}
        />
        <Tab.Screen name="Policy" component={Policy} />
        {/* <Tab.Screen name="PolicyList" component={PolicyList} />        
        <Tab.Screen name="PolicySubcategory" component={PolicySubcategory} /> */}
      </Tab.Navigator>
    </SafeAreaProvider>
  );
}
