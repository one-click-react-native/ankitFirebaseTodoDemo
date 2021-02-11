import React from "react";
import Loader from "react-native-modal-loader";

const AppLoader = props => {
  return (
    <Loader loading={props.isLoading} size="large" color='#000' />
  );
};

export default AppLoader;
