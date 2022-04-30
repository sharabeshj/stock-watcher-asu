import {FunctionComponent, useEffect, useState} from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    LineChart,
    CartesianGrid,
    Tooltip,
    Line,
    AreaChart,
    Area,
  } from "recharts";
import moment from 'moment';
import { AxiosRequestConfig } from 'axios';

import { CandleData } from '../Types/StockTypes';
import {  WatcherConnector, WatcherReducerProps } from '../Reducers/WatcherReducer';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';
import { Box, Button, ButtonGroup, Stack } from '@mui/material';


class StockWatcherApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getCandles.bind(this);
    }
    
    public getCandles(): Promise<any> {
        return this.get<any>('/stock/candle');
    }
}

const Config: any = {
    "1": {
        fromTime: () => moment().subtract(15, 'minutes').unix(),
        resolution: "1",
        tickFormatter: (t:any) => moment.unix(t).format('HH:mm')

    },
    "5": {
        fromTime: () => moment().subtract(1, 'hour').unix(),
        resolution: "5",
        tickFormatter: (t:any) => moment.unix(t).format('HH:mm')
    },
    "15": {
        fromTime: () => moment().subtract(3, 'hours').unix(),
        resolution: "15",
        tickFormatter: (t:any) => moment.unix(t).format('HH:mm')
    },
    "30": {
        fromTime: () => moment().subtract(6, 'hours').unix(),
        resolution: "30",
        tickFormatter: (t:any) => moment.unix(t).format('HH:mm')
    },
    "60": {
        fromTime: () => moment().subtract(1, 'day').unix(),
        resolution: "60",
        tickFormatter: (t:any) => moment.unix(t).format('HH:mm')
    },
    "D": {
        fromTime: () => moment().subtract(1, 'month').unix(),
        resolution: "D",
        tickFormatter: (t:any) => moment.unix(t).format('MM/DD')
    },
    "W": {
        fromTime: () => moment().subtract(3, 'months').unix(),
        resolution: "W",
        tickFormatter: (t:any) => moment.unix(t).format('MM/DD')
    },
    "M": {
        fromTime: () => moment().subtract(1, 'year').unix(),
        resolution: "M",
        tickFormatter: (t:any) => moment.unix(t).format('MM/DD')
    }
}

const StockWatcher: FunctionComponent<WatcherReducerProps & { symbol: string, expanded: string | false }> = ({ symbol, expanded }) => {
    const [candleData, setCandleData] = useState<CandleData[]>([]);
    const [curConfig, setCurConfig] = useState<string>('15');
    const [timer, setTimer] = useState<number>(0);
    const [temp, setTemp] = useState<number>(0);

    useEffect(() => {
        if(expanded === symbol) {
            const getCandles = () => {
                const stockWatcherApi = new StockWatcherApi({
                    ...apiConfig,
                    params: {
                        ...apiConfig.params,
                        symbol: symbol,
                        resolution: Config[curConfig].resolution,
                        from: Config[curConfig].fromTime(),
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
                            } else {
                                setCurConfig("60");
                            }                    
                        });
            }
            getCandles();
            const t = window.setInterval(() => {
                getCandles();
            }, 5000);
            setTemp(t);
        }
    }, [symbol, expanded, curConfig]);

    useEffect(() => {
        if(expanded !== symbol){
            window.clearInterval(timer);
            setTemp(0);
        }
    }, [symbol, expanded, timer]);

    useEffect(() => {
        setTimer(temp);
    }, [temp]);

    useEffect(() => {
        if(temp !== timer)
            window.clearInterval(timer);
    }, [temp, timer]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
          return (
            <div className="custom-tooltip">
              <p className="label">{`${Config[curConfig].tickFormatter(label)} : $${payload[0].value}`}</p>
            </div>
          );
        } else {
            return (<p></p>)
        }
    }

    const chart = (
        <ResponsiveContainer aspect={1.5} width = '99%'  >
            <AreaChart data={candleData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4caf50" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#4caf50" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis
                    dataKey = 't'
                    domain = {['auto', 'auto']}
                    name = 'Time'
                    tickFormatter = {(t) => Config[curConfig].tickFormatter(t)}
                    type = 'number'
                />
                <YAxis name = 'Value' tickFormatter={t => `$${t}`} domain={['dataMin - 10', 'dataMax + 10']}/>
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="c" stroke="#4caf50" fillOpacity={1} fill="url(#colorPv)" />
            </AreaChart>
        </ResponsiveContainer>);

    return (
    <Stack spacing={2}>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
            <Button disabled={curConfig === "1"} onClick={() => setCurConfig("1")}>1</Button>
            <Button disabled={curConfig === "5"} onClick={() => setCurConfig("5")}>5</Button>
            <Button disabled={curConfig === "15"} onClick={() => setCurConfig("15")}>15</Button>
            <Button disabled={curConfig === "30"} onClick={() => setCurConfig("30")}>30</Button>
            <Button disabled={curConfig === "60"} onClick={() => setCurConfig("60")}>60</Button>
            <Button disabled={curConfig === "D"} onClick={() => setCurConfig("D")}>D</Button>
            <Button disabled={curConfig === "W"} onClick={() => setCurConfig("W")}>W</Button>
            <Button disabled={curConfig === "M"} onClick={() => setCurConfig("M")}>M</Button>
        </ButtonGroup>
        {chart}
    </Stack>);
}

export default WatcherConnector(StockWatcher);