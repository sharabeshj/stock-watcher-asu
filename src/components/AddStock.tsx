import React, { FunctionComponent, useState } from 'react';

import { StockData } from '../Types/AddStockTypes';
import {StockReducerProps, StockConnector} from '../Reducers/StockReducer';

const AddStock: FunctionComponent<StockReducerProps> = ({ add_stock}) => {

    const initSaveData: StockData = {
        ticker: ""        
    };


    const [saveData, setSaveData] = useState<StockData>(initSaveData);


    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, key?:string) => {
        if (key) {
            setSaveData({
                ...saveData,
                [key]: e.target.value
            });
        }
    }

    const handleSubmit = () => {
        add_stock(saveData);
        setSaveData(initSaveData);
    }

    return (
        <div className="addStock">
            <form noValidate autoComplete='off'>
                <label htmlFor="ticker">Search Stock</label>
                <input type="search" name="ticker" id="ticker" value={saveData.ticker} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, 'ticker')}/>
                <input type="button" value="Search" onClick={() => handleSubmit()}/>
            </form>
        </div>
    );
}

export default StockConnector(AddStock);