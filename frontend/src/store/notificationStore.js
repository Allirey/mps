import {observable, computed, action, decorate} from 'mobx';

class NotificationStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    isOpen = false;
    text = '';

    severityList = {1: 'success', 2: 'info', 3: 'warning', 4: 'error'}
    severity = this.severityList[1]

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.isOpen = false;
    }

    notify = (text, severity = 1) => {
        this.text = text;
        this.severity = this.severityList[[severity]];
        this.isOpen = true;
    }
}

decorate(NotificationStore, {
        text: observable,
        isOpen: observable,

        handleClose: action,
        notify: action,
    }
);

export default NotificationStore;