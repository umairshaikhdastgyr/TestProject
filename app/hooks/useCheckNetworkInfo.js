import {useState, useEffect} from 'react';
import NetInfo from '@react-native-community/netinfo';

const useCheckNetworkInfo = () => {
  const [internetAvailable, setInternetAvailable] = useState(null);

  useEffect(() => {
    let unsubscribe = () => {};
    NetInfo.fetch().then((state) => {
      setTimeout(() => {
        if (state.isConnected) {
          setInternetAvailable(true);
        } else {
          setInternetAvailable(false);
        }
        unsubscribe = NetInfo.addEventListener((state) => {
          if (state.isInternetReachable) {
            setInternetAvailable(true);
          } else {
            setInternetAvailable(false);
          }
        });
      }, 1000);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {internetAvailable};
};

export default useCheckNetworkInfo;
