import {FunctionComponent, useEffect, useState} from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    LineChart,
    CartesianGrid,
    Tooltip,
    Line,
  } from "recharts";
import moment from 'moment';
import { AxiosRequestConfig } from 'axios';

import { CandleData } from '../Types/StockTypes';
import {  WatcherConnector, WatcherReducerProps } from '../Reducers/WatcherReducer';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';


class StockWatcherApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getCandles.bind(this);
    }
    
    public getCandles(): Promise<any> {
        return this.get<any>('/stock/candle');
    }
}

const StockWatcher: FunctionComponent<WatcherReducerProps & { symbol: string, expanded: string | false }> = ({ symbol, expanded }) => {
    const [candleData, setCandleData] = useState<CandleData[]>([]);
    const [timer, setTimer] = useState<NodeJS.Timer | null>(null);

    useEffect(() => {
        return () => {
            if(timer) clearInterval(timer);
        }
    })

    useEffect(() => {
        if(expanded === symbol) {
            const getCandles = () => {
                const stockWatcherApi = new StockWatcherApi({
                    ...apiConfig,
                    params: {
                        ...apiConfig.params,
                        symbol: symbol,
                        resolution: 'D',
                        from: moment().subtract(3, 'months').unix(),
                        to:moment().unix()
                    }
                });
                stockWatcherApi.getCandles()
                        .then(d => {
                            if(d['s'] === 'ok'){
                                let data: any[] = [], c = d['c'], t = d['t'];
                            c.forEach((ele: number, i: number)=>{
                                data.push({ c: ele, t: t[i]});
                            })
                            setCandleData(data);
                            }                    
                        });
            }
            getCandles();
            const timer = setInterval(() => {
                getCandles();
            }, 5000);
            setTimer(timer);
        }
    }, [symbol, expanded]);

    useEffect(() => {
        if(expanded !== symbol) {
            if(timer) {
                clearInterval(timer);
            }
        }
    }, [expanded, symbol, timer]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`${moment.unix(label).format('MM/DD/YYYY')} : $${payload[0].value}`}</p>
            </div>
          );
        } else {
            return (<p></p>)
        }
    }

    const chart = (
        <ResponsiveContainer width = '95%' minWidth={'500px'} height = {500} >
            <LineChart
            data={candleData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey = 't'
                domain = {['auto', 'auto']}
                name = 'Time'
                tickFormatter = {(t) => moment.unix(t).format('MM/DD/YYYY')}
                type = 'number'
            />
            <YAxis name = 'Value' tickFormatter={t => `$${t}`}/>
            <Tooltip content={<CustomTooltip />}/>
            <Line type="monotone" dataKey="c" stroke="#8884d8" />
            </LineChart>
        </ResponsiveContainer>);

    return (chart)
}

export default WatcherConnector(StockWatcher);