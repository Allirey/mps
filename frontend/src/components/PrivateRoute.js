import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import withStore from '../hocs/withStore';

class PrivateRoute extends React.Component {
    render() {
        const {userStore, ...restProps} = this.props;
        if (userStore.currentUser) return <Route {...restProps} />;
        return <Redirect to="/login"/>;
    }
}

export default withStore(PrivateRoute);