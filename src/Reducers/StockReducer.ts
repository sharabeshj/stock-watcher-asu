import {connect, ConnectedProps} from 'react-redux';
import {ThunkDispatch} from 'redux-thunk';

import {ActionMap} from '../Types/InitialStoreStateTypes';
import {StockStoreType} from '../Types/StockTypes';
import {mainState} from '../Store';
import {StockData} from '../Types/AddStockTypes';

export enum StockActionTypes {
    ADD_STOCK = 'ADD_STOCK',
    CLEAR_STOCK = 'CLEAR_STOCK'
}

type Payload = {
    [StockActionTypes.ADD_STOCK]: {
        value: StockData
    },
    [StockActionTypes.CLEAR_STOCK]: undefined
}

export type StockActions = ActionMap<Payload>[keyof ActionMap<Payload>];

export const stockState: StockStoreType = {
    stocks: []
}

export const StockReducer = (state: StockStoreType = stockState, action: StockActions): StockStoreType => {
    switch(action.type) {
        case StockActionTypes.ADD_STOCK:
            return {
                ...state,
                stocks: [...state.stocks, action.payload.value]
            }
        case StockActionTypes.CLEAR_STOCK:
            return {
                ...state,
                stocks: []
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
    },
    clear_stock: () => {
        dispatch({
            type: StockActionTypes.CLEAR_STOCK
        })
    }
})

export const StockConnector = connect(mapStockStateToProps, mapStockDispatchToProps);

export type StockReducerProps = ConnectedProps<typeof StockConnector>;