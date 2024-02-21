import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserInfo, getUserInfoLocal } from "#modules/User/actions";
import { LocalStorage } from "#services";
import {getUserInfo as getUserInfoApi} from "#services/apiUsers";
import useCheckNetworkInfo from "../hooks/useCheckNetworkInfo";

const CheckConnection = () => {
  const dispatch = useDispatch();
  const { internetAvailable } = useCheckNetworkInfo();

  const getUserInfoIfExists = async () => {
    let data = await LocalStorage.getUserInformation();
    if (data?.id) {
      const getUserDetail = await getUserInfoApi({userId: data?.id})
      if(Object.keys(getUserDetail)?.length > 0){
        dispatch(getUserInfoLocal(getUserDetail));
      }
    }
  };

  useEffect(() => {
      if (internetAvailable) {
        getUserInfoIfExists();
      }
  }, [internetAvailable]);

  return internetAvailable;
};

export default CheckConnection;
