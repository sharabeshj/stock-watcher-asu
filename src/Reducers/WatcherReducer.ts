import {connect, ConnectedProps} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';

import {ActionMap} from '../Types/InitialStoreStateTypes';
import {WatcherStoreType} from '../Types/StockTypes';
import {mainState} from '../Store';

export enum WatcherActionTypes {
}

type Payload = {
}

export type WatcherActions = ActionMap<Payload>[keyof ActionMap<Payload>];

export const watcherState: WatcherStoreType = {
}

export const WatcherReducer = (state: WatcherStoreType = watcherState, action: WatcherActions): WatcherStoreType => {
    return {}
}

export const mapStockStateToProps = (state: mainState) => ({
});

export const mapStockDispatchToProps = (dispatch: ThunkDispatch<mainState, unknown, WatcherActions>) => ({

})

export const WatcherConnector = connect(mapStockStateToProps, mapStockDispatchToProps);

export type WatcherReducerProps = ConnectedProps<typeof WatcherConnector>;