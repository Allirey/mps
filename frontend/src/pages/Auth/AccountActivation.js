import {useEffect} from 'react';
import {useParams} from "react-router-dom";
import {Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import Spinner from '../../components/spinner';

function AccountActivation(props) {
    const {id, token} = useParams();

    useEffect(() => {
        props.stores.authStore.activate(id, token).then(() => {
                props.stores.notifications.notify("Successfully activated! You can now login into your account.")
                props.history.replace("/login")
            }
        ).catch((e) => {
            props.stores.notifications.notify("Activation failed. Link corrupted or expired.", 4)
            props.history.replace("/")
        })
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <Spinner/>
        </Container>
    );
}

export default withStore(AccountActivation);