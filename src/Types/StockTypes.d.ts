import {StockData} from './AddStockTypes';

export type StockStoreType = {
    stocks: StockData[];
}

export type WatcherStoreType = {
    marketClose: boolean
}

export type PriceData = {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
}

export type CandleData = {
    c: number;
    t: number;
}
