import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';

import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {GENERAL} from '../redux/store/TypeConstants';
import {useSelector, useDispatch} from 'react-redux';

import Welcome from '../screens/welcome/Welcome';

import Splash from '../screens/auth/Splash';
import Register1 from '../screens/auth/Register1';
import Register2 from '../screens/auth/Register2';
import SetPassword from '../screens/auth/SetPassword';
import OTPVerification from '../screens/auth/OTPVerification';
import Login from '../screens/auth/Login';
import ForgotPassword from '../screens/auth/ForgotPassword';

import PrivacyPolicy from '../screens/main/PrivacyPolicy';
import TermsAndConditions from '../screens/main/TermsAndConditions';

import AddCompany from '../screens/main/AddCompany';
import AddFamilyMember from '../screens/main/AddFamilyMember';
import CompanyList from '../screens/main/CompanyList';
import FamilyMemberList from '../screens/main/FamilyMemberList';

import AddSignature from '../screens/main/AddSignature';
import Documents from '../screens/main/Documents';
import PolicyDetails from '../screens/main/PolicyDetails';

import NewMessage from '../screens/main/NewMessage';
import ViewMessage from '../screens/main/ViewMessage';
import MyInsuranceAdvisor from '../screens/main/MyInsuranceAdvisor';
import RateAdvisor from '../screens/main/RateAdvisor';

import InviteFriend from '../screens/main/InviteFriend';
import InviteFriends from '../screens/main/InviteFriends';
import PDFViewer from '../screens/main/PdfViewer';

import EditProfile from '../screens/main/EditProfile';
import Help from '../screens/main/Help';
import CompanyPolicyOverview from '../screens/main/CompanyPolicyOverview';

import Broker from '../screens/main/Broker';

import PolicyList from '../screens/main/PolicyList';
import PolicySubcategory from '../screens/main/PolicySubcategory';

import TabNav from './TabNav';

const Stack = createStackNavigator();

export default function StackNav() {
  const dispatch = useDispatch();

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        //setNoti(remoteMessage);
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          //setNoti(remoteMessage);
        }
      });
  }, []);

  const setNoti = data => {
    //setLoading(true);
    dispatch({
      type: GENERAL.SET_NOTIFICATION_SUCCESS.type,
      data: {
        [GENERAL.SET_NOTIFICATION_SUCCESS.value]: data,
      },
    });
    //setTimeout(() => setLoading(false), 200);
  };

  const TokenReducer = useSelector(state => state.TokenReducer);
  const ProfileReducer = useSelector(state => state.ProfileReducer);
  //const GeneralReducer = useSelector(state => state.GeneralReducer);

  //const [loading, setLoading] = useState(GeneralReducer?.notifications?.data?.notify_type == 'PD');

  if (TokenReducer.loading) return <Splash />;
  return (
    <NavigationContainer>
      {TokenReducer.token == null ? (
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Register1" component={Register1} />
          <Stack.Screen name="Register2" component={Register2} />
          <Stack.Screen name="OTPVerification" component={OTPVerification} />
          <Stack.Screen name="SetPassword" component={SetPassword} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        </Stack.Navigator>
      ) : !ProfileReducer?.profileDetails?.signature ||
        ProfileReducer?.profileDetails?.signature == '' ? (
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="SGC" component={AddSignature} />
          <Stack.Screen name="PDFViewer" component={PDFViewer} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator headerMode={'none'}>
          <Stack.Screen name="Policy" component={TabNav} />
          <Stack.Screen name="Documents" component={Documents} />          
          <Stack.Screen name="PolicyDetails" component={PolicyDetails} />
          <Stack.Screen name="NewMessage" component={NewMessage} />
          <Stack.Screen name="ViewMessage" component={ViewMessage} />
          <Stack.Screen
            name="MyInsuranceAdvisor"
            component={MyInsuranceAdvisor}
          />
          <Stack.Screen name="RateAdvisor" component={RateAdvisor} />
          <Stack.Screen name="InviteFriend" component={InviteFriend} />
          <Stack.Screen name="InviteFriends" component={InviteFriends} />

          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Help" component={Help} />          
          <Stack.Screen name="Broker" component={Broker} />
          <Stack.Screen name="PolicyList" component={PolicyList} />

          <Stack.Screen name="AddCompany" component={AddCompany} />
          <Stack.Screen name="AddFamilyMember" component={AddFamilyMember} />
          <Stack.Screen name="CompanyList" component={CompanyList} />
          <Stack.Screen name="FamilyMemberList" component={FamilyMemberList} />

          <Stack.Screen name="PDFViewer" component={PDFViewer} />
          <Stack.Screen name="AddSignature" component={AddSignature} />

          <Stack.Screen
            name="PolicySubcategory"
            component={PolicySubcategory}
          />
          <Stack.Screen
            name="CompanyPolicyOverview"
            component={CompanyPolicyOverview}
          />

          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicy}
          />
          <Stack.Screen
            name="TermsAndConditions"
            component={TermsAndConditions}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
