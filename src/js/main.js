
const toggl = {
    editId: 'edit-key',
    formId: 'toggl-form',
    inputId: 'toggl-key',
    saveId: 'save-toggl',
    storageKey: 'togglKey',
    apiKey: '',

    init: function () {
        this.addEvents();
        this.setKeyInputValue();
    },

    addEvents: function () {
        document.getElementById(this.editId).addEventListener('click', this.handleEditClick.bind(this));
        document.getElementById(this.saveId).addEventListener('click', this.handleSaveClick.bind(this));
    },

    handleEditClick: function () {
        this.toggleKeyForm();
    },

    handleSaveClick: function () {
        this.setKey();
        this.toggleKeyForm();
    },

    toggleKeyForm: function () {
        document.getElementById(this.formId).classList.toggle('hidden');
    },

    setKeyInputValue: function () {
        this.getKey((items) => {
            if (!items[this.storageKey]) {
                return;
            }
            this.apiKey = items[this.storageKey]
            document.getElementById(this.inputId).value = this.apiKey;
        });
    },

    getKey: function (callback) {
        chrome.storage.sync.get(this.storageKey, callback);
    },

    setKey: function () {
        this.apiKey = document.getElementById(this.inputId).value;
        chrome.storage.sync.set({
            [this.storageKey]: this.apiKey
        });
    }
}

const createTimeEntry = {
    apiUrl: 'https://www.toggl.com/api/v8/time_entries/start',
    descriptionId: 'description',
    ticketId: 'ticket',
    startId: 'start',

    init: function () {
        this.requestReviewInfo();
        document.getElementById(this.startId).addEventListener('click', createTimeEntry.submit.bind(this));
    },

    submit: function () {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this.apiUrl);
        xhr.setRequestHeader('Authorization', btoa(toggl.apiKey + ':api_token'));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            "time_entry": {
                "description": this.getEntryDescription(),
                "created_with": 'PR Review Chrome Extension'
            }
        }));
    },

    getEntryDescription: function () {
        let ticketEl = document.getElementById(this.ticketId);
        let descriptionEl = document.getElementById(this.descriptionId);

        return descriptionEl.value + ' (#' + ticketEl.value + ')';
    },

    requestReviewInfo: function () {
        chrome.tabs.getSelected(null, (tab) => {
            chrome.tabs.sendRequest(tab.id, {action: 'getPR'}, (response) => {
                if (!response) {
                    return;
                }
                this.setInputValues(response);
            });
        });
    },

    setInputValues: function (data) {
        document.getElementById(this.descriptionId).value = 'Code Review: ' + data.title;
        document.getElementById(this.ticketId).value = data.ticket;
    }
}

toggl.init();
createTimeEntry.init();