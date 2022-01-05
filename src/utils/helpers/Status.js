import {useIsFocused} from '@react-navigation/native';
export default function () {
  allStatus = [];
  this.status = function (reducerStatus, ...params) {
    //console.log(allStatus);
    const screen = this.status.caller.name;
    const isFocusedNow = useIsFocused();
    if (
      isFocusedNow == true &&
      allStatus.findIndex(
        itemStatus =>
          itemStatus.name == reducerStatus && itemStatus.screen == screen,
      ) == -1 &&
      reducerStatus != ''
    ) {
      params.forEach(current => {
        const REQUEST = current[0];
        const statusText = new String(REQUEST).substr(0, REQUEST.length - 7);
        const SUCCESS = statusText + 'SUCCESS';
        const FAILD = statusText + 'FAILURE';

        const request = current[3];
        const success = current[1];
        const faild = current[2];

        const statusIndexRequest = allStatus.findIndex(
          itemStatus =>
            itemStatus.name == REQUEST && itemStatus.screen == screen,
        );
        const statusIndexSuccess = allStatus.findIndex(
          itemStatus =>
            itemStatus.name == SUCCESS && itemStatus.screen == screen,
        );
        const statusIndexFaild = allStatus.findIndex(
          itemStatus => itemStatus.name == FAILD && itemStatus.screen == screen,
        );
        const statusIndexItem = allStatus.findIndex(
          itemStatus =>
            new String(itemStatus.name).startsWith(statusText) &&
            itemStatus.screen == screen,
        );

        switch (reducerStatus) {
          case REQUEST:
            if (statusIndexRequest == -1) {
              statusIndexItem == -1
                ? allStatus.push({
                    name: reducerStatus,
                    screen: screen,
                  })
                : (allStatus[statusIndexItem].name = reducerStatus);
              typeof request == 'function' ? request() : null;
            }
            return;

          case SUCCESS:
            if (statusIndexRequest != -1 && statusIndexSuccess == -1) {
              statusIndexItem == -1
                ? allStatus.push({
                    name: reducerStatus,
                    screen: screen,
                  })
                : (allStatus[statusIndexItem].name = reducerStatus);
              typeof success == 'function' ? success() : null;
            }
            return;

          case FAILD:
            if (statusIndexRequest != -1 && statusIndexFaild == -1) {
              statusIndexItem == -1
                ? allStatus.push({
                    name: reducerStatus,
                    screen: screen,
                  })
                : (allStatus[statusIndexItem].name = reducerStatus);
              typeof faild == 'function' ? faild() : null;
            }
            return;
        }
      });
    }
  };
}
