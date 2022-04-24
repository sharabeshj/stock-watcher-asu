import { FunctionComponent, ReactNode } from 'react';
import {applyMiddleware, combineReducers} from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import thunk from 'redux-thunk';

import {StockReducer} from './Reducers/StockReducer';

const mainReducer = combineReducers({
    stock: StockReducer
});

export type mainState = ReturnType<typeof mainReducer>;

export const StoreProvider: FunctionComponent<{ children: ReactNode}> = ({ children }) => {
    const store = configureStore({ reducer: mainReducer, enhancers: [applyMiddleware(thunk)] });

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}