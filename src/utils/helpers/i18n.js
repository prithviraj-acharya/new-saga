import * as RNLocalize from 'react-native-localize';
import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import {I18nManager} from 'react-native';

const translationGetters = {
  en: () => require('../../translations/en.json'),
  fr: () => require('../../translations/fr.json'),
};

export const setAppLanguage = (languaageName = 'fr') => {
  const fallback = {languageTag: languaageName, isRTL: false};
  const {languageTag, isRTL} = fallback;
  //RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
  translate.cache.clear();
  I18nManager.forceRTL(isRTL);
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};
export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);
