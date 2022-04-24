import {connect, ConnectedProps} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';

import {ActionMap} from '../Types/InitialStoreStateTypes';
import {StockStoreTypes} from '../Types/StockTypes';
import {mainState} from '../Store';
import {StockData} from '../Types/AddStockTypes';

export enum StockActionTypes {
    ADD_STOCK = 'ADD_STOCK'
}

type Payload = {
    [StockActionTypes.ADD_STOCK]: {
        value: StockData
    }
}

export type StockActions = ActionMap<Payload>[keyof ActionMap<Payload>];

export const stockState: StockStoreTypes = {
    stocks: []
}

export const StockReducer = (state: StockStoreTypes = stockState, action: StockActions): StockStoreTypes => {
    switch(action.type) {
        case StockActionTypes.ADD_STOCK:
            return {
                ...state,
                stocks: [...state.stocks, action.payload.value]
            }
        default:
            return state;
    }   
}

export const mapStockStateToProps = (state: mainState) => ({
    ...state.stock
});

export const mapStockDispatchToProps = (dispatch: ThunkDispatch<mainState, unknown, StockActions>) => ({
    add_stock: (data: StockData) => {
        dispatch({
            type: StockActionTypes.ADD_STOCK,
            payload: {
                value: data
            }
        });
    }
})

export const StockConnector = connect(mapStockStateToProps, mapStockDispatchToProps);

export type StockReducerProps = ConnectedProps<typeof StockConnector>;