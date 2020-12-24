import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import withStore from '../hocs/withStore';

function PrivateRoute(props) {
    const {stores, ...restProps} = props;
    if (stores.authStore.isAuthenticated) return <Route {...restProps} />;
    return <Redirect to={{pathname: '/login', state: {from: props.location}}}/>;
}

export default withStore(PrivateRoute);