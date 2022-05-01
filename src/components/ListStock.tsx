import { Accordion, AccordionDetails, AccordionSummary, Divider, Box, Typography, Grid, Stack } from '@mui/material';
import {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AxiosRequestConfig } from 'axios';
import { green, red } from '@mui/material/colors';

import {StockConnector, StockReducerProps} from '../Reducers/StockReducer';
import StockWatcher from './StockWatcher';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';
import { StockData } from '../Types/AddStockTypes';
import { theme } from '../App';
import { PriceData } from '../Types/StockTypes';
import { WatcherConnector, WatcherReducerProps } from '../Reducers/WatcherReducer';

class ListStockApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getQuote.bind(this);
    }
    
    public getQuote(): Promise<PriceData> {
        return this.get<PriceData>('/quote');
    }

}

const UnconnectedStockListItem: FunctionComponent<WatcherReducerProps & {stock: StockData, expanded: string | false ,handleChange: (s : string) => any}> = ({ stock, expanded, handleChange, marketClose }) => {
    const [curPrice, setCurPrice] = useState<PriceData>({ c: 0, d: 0, dp: 0, h: 0, l: 0, o: 0, pc: 0 });
    const [socPrice, setSocPrice] = useState<number>(0);
    const [timer, setTimer] = useState<number>(0);

    useEffect(() => {
        let socket: any = null;
        if(expanded === stock.symbol){
                    //websocket
                    socket = new WebSocket('wss://ws.finnhub.io?token=c9kcp3qad3i81ufrsg9g');
                    socket.addEventListener('open', (event: any) => {
                        socket.send(JSON.stringify({'type':'subscribe', 'symbol': stock.symbol}))
                    });
                    socket.addEventListener('message', (event: any) => {
                        const data = JSON.parse(event.data);
                        if(expanded === stock.symbol)
                            setSocPrice(data['data'][data['data'].length - 1]['p']);
                    });
                }
                if(marketClose && socket !== null) 
                    socket.close();
            return () => {
                if(socket)
                    socket.close();
            }
        }, [expanded,stock.symbol, marketClose])

    useEffect(() => {
        const getQuote = () => {
            const listStockApi = new ListStockApi({
                    ...apiConfig,
                    params: {
                        ...apiConfig.params,
                        symbol: stock.symbol
                    }
                });
                listStockApi.getQuote()
                    .then(d => setCurPrice(d));
            }
        if(!marketClose){
            getQuote();
            const t = window.setInterval(() => {
                getQuote()
            }, 5000);
            setTimer(t);
        }
    }, [stock.symbol, marketClose]);

    useEffect(() => {
        const getQuote = () => {
            const listStockApi = new ListStockApi({
                    ...apiConfig,
                    params: {
                        ...apiConfig.params,
                        symbol: stock.symbol
                    }
                });
                listStockApi.getQuote()
                    .then(d => setCurPrice(d));
            }
        if(marketClose) {
            getQuote();
            window.clearInterval(timer);
        }
    }, [stock.symbol, timer, marketClose])

    
    const watcher = (<StockWatcher symbol={stock.symbol} expanded={expanded}/>)
    return (
        <Accordion expanded={expanded === stock.symbol} onChange={handleChange(stock.symbol)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`${stock.symbol}-content`} id={`${stock.symbol}-header`}>
                <Typography sx={{ width: '20%', flexShrink: 0 }} gutterBottom variant="h6" component="div">
                    {stock.description}
                </Typography>
                    {expanded !== stock.symbol ? (
                        <Box sx={{ width: '33%', flexShrink: 0 }}>
                            <Typography gutterBottom variant="h6" component="p">
                                {`$${curPrice.c}`}
                            </Typography>
                            <Typography sx={{ color: curPrice.d >=0 ? green[700]: red[600] }} gutterBottom variant="subtitle2" component="p">
                                {`${curPrice.d >=0 ? '+' : ''}${curPrice.d} (${curPrice.d >=0 ? '+' : ''}${curPrice.dp}%)`}
                            </Typography>
                            </Box>
                        ) : null }
                <Typography gutterBottom sx={{ color: 'text.secondary' }}>{stock.symbol}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container justifyContent={'center'}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Stack style={{ height: '100%' }} sx={{ display: "flex", justifyContent:"space-around"}}>
                            <Box>
                                <Typography gutterBottom variant="h4" component="p">
                                    {socPrice === 0 ? `$${curPrice.c}`: `$${socPrice}`}
                                </Typography>
                                <Typography sx={{ color: curPrice.d >=0 ? green[700]: red[600] }} gutterBottom variant="h6" component="p">
                                    {`${curPrice.d >=0 ? '+' : ''}${curPrice.d} (${curPrice.d >=0 ? '+' : ''}${curPrice.dp}%)`}
                                </Typography>
                            </Box>
                            <Stack sx={{ padding: theme.spacing(2)}}>
                                <Box sx={{ borderBottom: "1px solid #7b7b7b", display: "flex", justifyContent: "space-between" }}>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`Day High`}
                                    </Typography>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`${curPrice.h}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ borderBottom: "1px solid #7b7b7b", display: "flex", justifyContent: "space-between" }}>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`Day Low`}
                                    </Typography>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`${curPrice.l}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ borderBottom: "1px solid #7b7b7b", display: "flex", justifyContent: "space-between" }}>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`Open`}
                                    </Typography>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`${curPrice.o}`}
                                    </Typography>
                                </Box>
                                <Box sx={{ borderBottom: "1px solid #7b7b7b", display: "flex", justifyContent: "space-between" }}>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`Previous Close`}
                                    </Typography>
                                    <Typography  variant="overline" component="div" display="flex" >
                                        {`${curPrice.pc}`}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6} md={8}>
                        {watcher}
                    </Grid>
                </Grid>
            </AccordionDetails>
        </Accordion>
    )
}

const StockListItem = WatcherConnector(UnconnectedStockListItem);

const ListStock: FunctionComponent<StockReducerProps> = ({ stocks }) => {
    const [expanded, setExpanded] = useState<string | false>(false);

    const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel: false);
    }

    const stockList = stocks.map(s => {
        return (<StockListItem stock={s} handleChange={handleChange} expanded={expanded} key={s.figi} />);
    });


    return (
        <Box sx={{ wwidth: '100%'}}>
            <Typography variant="h4" gutterBottom component="div">
                Your Watchlist
            </Typography>
            <Divider />
            <Box sx={{ padding: theme.spacing(2), margin: theme.spacing(1) }}>
                {stockList}
            </Box>
            
        </Box>
        );
}

export default StockConnector(ListStock);