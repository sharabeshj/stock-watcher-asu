import {StockData} from './AddStockTypes';

export type StockStoreType = {
    stocks: StockData[]
}

export type WatcherStoreType = {
}

export type PriceData = {
    c: number;
    t: number;
}
