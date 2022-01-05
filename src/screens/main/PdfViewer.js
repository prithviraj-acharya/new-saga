import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import {Colors, Fonts} from '../../themes/Themes';
import Header from '../../components/Header';
import MyStatusBar from '../../utils/MyStatusBar';

import Pdf from 'react-native-pdf';
import {translate} from '../../utils/helpers/i18n';
import normalize from '../../utils/helpers/normalize';
import Loader from '../../utils/helpers/Loader';

var RNFetchBlob = require('rn-fetch-blob').default;

export default function PDFViewer(props) {
  const [loader, setLoader] = useState(false);

  const uri = props?.route?.params?.uri;
  const customName = props?.route?.params?.customName;
  var filename = uri.replace(/^.*[\\\/]/, '');
  if(customName && customName!=""){
    filename=customName;
  }
  const source = {
    uri: uri,
    cache: false,
  };
  const androidDownload = () => {
    try {
      setLoader(true);
      const {dirs} = RNFetchBlob.fs;
      RNFetchBlob.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          mediaScannable: true,
          title: filename,
          path: `${dirs.DownloadDir}/${filename}`,
        },
      })
        .fetch('GET', source.uri, {})
        .then(res => {
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
        });
    } catch (ex) {
      setLoader(false);
    }
  };
  const iosDownload = () => {
    try {
      setLoader(true);
      const {dirs} = RNFetchBlob.fs;
      const dirToSave =
        Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        mediaScannable: true,
        title: filename,
        path: `${dirToSave}/${filename}`,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: 'pdf',
        }
      });
      RNFetchBlob.config(configOptions)
        .fetch('GET', source.uri, {})
        .then(res => {
          if (Platform.OS === 'ios') {
            RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
            RNFetchBlob.ios.previewDocument(configfb.path);
          }
          setLoader(false);
        })
        .catch(e => {
          setLoader(false);
        });
    } catch (Ex) {
      setLoader(false);
    }
  };
  return (
    <>
      <MyStatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
      <SafeAreaView style={{flex: 1, backgroundColor: Colors.white}}>
        <Header
          back={true}
          download={true}
          logo={true}
          downloadPress={async () => {
            try {
              if (Platform.OS == 'android') {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  androidDownload();
                } else {
                  Alert.alert(
                    translate('Permission Denied!'),
                    translate('YND'),
                  );
                }
              } else {
                iosDownload();
              }
            } catch (err) {
              console.log(err);
            }
          }}
          {...props}
        />
        <View style={styles.container}>
          <Pdf
            source={source}
            activityIndicator={
              <>
                <ActivityIndicator size="large" color={Colors.red} />
                <Text
                  style={{
                    fontFamily: Fonts.Montserrat_SemiBold,
                    fontSize: normalize(16),
                    lineHeight: normalize(16),
                    paddingTop: normalize(15),
                  }}>
                  {translate("Please wait")}
                </Text>
              </>
            }
            onLoadComplete={(numberOfPages, filePath) => {}}
            onPageChanged={(page, numberOfPages) => {}}
            onError={error => {}}
            onPressLink={uri => {}}
            style={styles.pdf}
          />
        </View>
      </SafeAreaView>
      <Loader visible={loader} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Colors.white,
  },
});
