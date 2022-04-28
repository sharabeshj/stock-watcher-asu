import {StockData} from './AddStockTypes';

export type StockStoreType = {
    stocks: StockData[];
}

export type WatcherStoreType = {
}

export type PriceData = {
    c: number;
    d: number;
    dp: number;
}

export type CandleData = {
    c: number;
    t: number;
}
