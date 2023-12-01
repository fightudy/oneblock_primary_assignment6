import {ApiPromise, WsProvider, Keyring} from "@polkadot/api"
import '@polkadot/api-augment'
import type { FrameSystemAccountInfo } from "@polkadot/types/lookup"


const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const WEB_SOCKET = 'ws://127.0.0.1:9944';
const connect = async () => {
    const wsProvider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({provider: wsProvider, types: {}});
    await api.isReady;
    return api;
}


const subscribe_something = async (api: ApiPromise) => {
    await api.query.templateModule.something((res: number) => {
        console.log(`The updated value of 'something' is ${res}`);
    });
}

const subscribe_event = async (api: ApiPromise) => {
    await api.query.system.events((events:any[]) => { 
        events.forEach( function (event) {
            console.log("index",event['event']['index'].toHuman());
            console.log("data ", event['event']['data'].toHuman());
        })
    });
}

const main = async () => {
    const api = await connect();
    await subscribe_something(api);
    await subscribe_event(api);
    console.log('-------------------');
    await sleep(5000000);
    console.log('main function')
}

main()
.then(() => {
    console.log('exits with success');
    process.exit(0);
})
.catch( err => {
    console.log('error is ', err);
    process.exit(1);
})
