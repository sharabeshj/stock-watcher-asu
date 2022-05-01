import {connect, ConnectedProps} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';

import {ActionMap} from '../Types/InitialStoreStateTypes';
import {WatcherStoreType} from '../Types/StockTypes';
import {mainState} from '../Store';

export enum WatcherActionTypes {
    CLOSE_MARKET = "CLOSE_MARKET"
}

type Payload = {
    [WatcherActionTypes.CLOSE_MARKET]: undefined
}

export type WatcherActions = ActionMap<Payload>[keyof ActionMap<Payload>];

export const watcherState: WatcherStoreType = {
    marketClose: false
}

export const WatcherReducer = (state: WatcherStoreType = watcherState, action: WatcherActions): WatcherStoreType => {
    switch(action.type) {
        case WatcherActionTypes.CLOSE_MARKET:
            return {
                ...state,
                marketClose: true
            }
        default: 
            return {
                ...state
            }
    }
}

export const mapStockStateToProps = (state: mainState) => ({
    marketClose: state.watcher.marketClose
});

export const mapStockDispatchToProps = (dispatch: ThunkDispatch<mainState, unknown, WatcherActions>) => ({
    close_market: () => {
        dispatch({
            type: WatcherActionTypes.CLOSE_MARKET
        });
    }
})

export const WatcherConnector = connect(mapStockStateToProps, mapStockDispatchToProps);

export type WatcherReducerProps = ConnectedProps<typeof WatcherConnector>;