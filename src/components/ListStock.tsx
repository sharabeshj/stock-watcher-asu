import {FunctionComponent} from 'react';

import {StockConnector, StockReducerProps} from '../Reducers/StockReducer';

const ListStock: FunctionComponent<StockReducerProps> = ({ stocks }) => {
    const stockList = stocks.map(s => (<li>{s.ticker}</li>));

    return (<ul>{stockList}</ul>);
}

export default StockConnector(ListStock);