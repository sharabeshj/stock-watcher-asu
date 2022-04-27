import React, {Component} from 'react';
import {
    ResponsiveContainer,
    XAxis,
    YAxis,
    ScatterChart,
    Scatter,
  } from "recharts";
import moment from 'moment';
import { Typography } from '@mui/material';
import { AxiosRequestConfig } from 'axios';

import { PriceData } from '../Types/StockTypes';
import { WatcherConnector, WatcherReducerProps } from '../Reducers/WatcherReducer';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';

  
const formatter = (value: string) => `$${value}`;

class StockWatcherApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getQuote.bind(this);
    }
    
    public getQuote(): Promise<any> {
        return this.get<any>('/quote');
    }

    public getCandles(): Promise<any> {
        return this.get<any>('/stock/candle');
    }
}

type StockWatcherState = { priceData: PriceData[], currentPrice: number, socket: WebSocket | null }

class StockWatcher extends Component<WatcherReducerProps & { symbol: string }, StockWatcherState> {
    
    count = 0;
    state: StockWatcherState = {
        priceData: [],
        currentPrice: 0,
        socket: null
    }

    stockWatcherApi = new StockWatcherApi({
        ...apiConfig,
        params: {
            ...apiConfig.params,
            symbol: this.props.symbol,
            resolution: 'D',
            from: 1648365439,
            to:1651043839
        }
    });

    componentDidMount(){
        if(this.count === 0){
            const socket = new WebSocket('wss://ws.finnhub.io?token=c9kcp3qad3i81ufrsg9g')
            // Connection opened -> Subscribe
            socket.addEventListener('open', (event) => {
                socket?.send(JSON.stringify({'type':'subscribe', 'symbol': this.props.symbol}))
            });

            // Listen for messages
            socket.addEventListener('message', (event) => {
                console.log(event.data);
                // setPriceData(event.data.map(d => d.data)));
            });

            socket.addEventListener('close', (event) => {
                console.log('closed');    
            });
            this.stockWatcherApi.getQuote()
                    .then(d => {
                        this.setState({ currentPrice: d['c']});
                    });
            this.stockWatcherApi.getCandles()
                .then(d => {
                    let data: any[] = [], c = d['c'], t = d['t'];
                    c.forEach((ele: number, i: number)=>{
                        data.push({ c: ele, t: t[i]});
                    })
                    this.setState({
                        priceData: data
                    });
                    console.log(this.state.priceData);
                })
        }
    }
    

    componentWillUnmount() {
        if(this.state.socket?.readyState === 1) {
            this.state.socket?.send(JSON.stringify({'type':'unsubscribe','symbol': this.props.symbol}));
            this.state.socket?.close();
        }
    }

    
    render(): React.ReactNode {
        const chart = (
            <ResponsiveContainer width = '95%' height = {500} >
                <ScatterChart>
                <XAxis
                    dataKey = 't'
                    domain = {['auto', 'auto']}
                    name = 'Time'
                    tickFormatter = {(t) => moment.unix(t).format('MM/DD/YYYY')}
                    type = 'number'
                />
                <YAxis dataKey = 'c' name = 'Value' />

                <Scatter
                    data = {this.state.priceData}
                    line = {{ stroke: '#eee' }}
                    lineJointType = 'monotoneX'
                    lineType = 'joint'
                    name = 'Values'
                />

                </ScatterChart>
                </ResponsiveContainer>);
        return (
            <div>
                <Typography variant="h4" gutterBottom component="div">
                    {formatter(this.state.currentPrice.toString())}            
                </Typography>
                { this.state.priceData.length > 0 ? chart : null }
            </div>)
    }
    
}

export default WatcherConnector(StockWatcher);