import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import { setOnlineStatus } from "../store/appSlice";
import { useAppDispatch } from "./redux";

export const useNetworkStatus = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setOnlineStatus(state.isConnected ?? false));
    });

    return unsubscribe;
  }, [dispatch]);
};
