import {FunctionComponent} from 'react';

import {StockConnector, StockReducerProps} from '../Reducers/StockReducer';
import StockWatcher from './StockWatcher';

const ListStock: FunctionComponent<StockReducerProps> = ({ stocks }) => {

    const stockList = stocks.map(s => {
        const watcher = (<StockWatcher symbol={s.symbol}/>)
        return (<li key={s.symbol}>{s.symbol} {watcher}</li>);
    });

    return (<div>
                
                <ul>{stockList}</ul>
            </div>);
}

export default StockConnector(ListStock);