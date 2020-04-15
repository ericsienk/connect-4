const RETRIEVED_TAG = ' ::Retrieved::';

function initialize() {
    const peer = new Peer('', { debug: 2 })
    peer.on('open', function (id) {
        console.log(id);
    });

    peer.on('error', function (err) {
        console.log(err);
    });

    function ping() {
        peer.socket.send({ type: 'ping' });
        setTimeout(ping, 16000);
    }

    ping();

    return peer;
}


function listen(client, subscriberMap) {
    client.on('data', (response) => {
        const parsed = JSON.parse(response);
        if (parsed.action.includes(RETRIEVED_TAG)) {
            return;
        }

        const subscribers = subscriberMap[parsed.action];
        if (subscribers && subscribers.length) {
            subscribers.forEach(s => s.onAction(parsed.data));
        }

        client.send(JSON.stringify({action: parsed.action + RETRIEVED_TAG, data: {}}));
    });
}

export class OnlineBroker {
    constructor() {
        this.subscriberMap = {};
     }

    creatSession(onGameId, onConnected) {
        this.peer = initialize();
        this.peer.on('open', (gameId) => {
            console.log('Connection opened for player A');
            onGameId(gameId);
            this.peer.on('connection', (client) => {
                this.client = client;
                listen(this.client, this.subscriberMap);
                onConnected();
            });
        });
    }
    
    connectSession(gameId, onConnected) {
        this.peer = initialize();
        if (this.client) {
            this.client.close();
        }

        this.peer.on('open', () => {
            console.log('Connection opened for player B');
            this.client = this.peer.connect(gameId, { reliable: true });
            this.client.on('open', () => {
                console.log('Connected to ' + this.client.peer);
                listen(this.client, this.subscriberMap);
                onConnected();
            });
        });
    }

    send(action, data, onRetrieved) {
        this.client.send(JSON.stringify({ action: action, data: data }));
        const callback = (response) => {
            const parsed = JSON.parse(response);
            if (parsed.action === action + RETRIEVED_TAG) {
                onRetrieved(true);
                this.client.off('data', callback);
            }
        };

        this.client.on('data', callback);
    }

    subscribe(action, onAction) {
        let subscribers = this.subscriberMap[action];
        if (!subscribers) {
            subscribers = [];
        }

        subscribers.push({ onAction });
        this.subscriberMap[action] = subscribers;
    }
}