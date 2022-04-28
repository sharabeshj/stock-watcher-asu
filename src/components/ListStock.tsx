import { Accordion, AccordionDetails, AccordionSummary, Divider, Box, Typography, Stack, Grid } from '@mui/material';
import {FunctionComponent, SyntheticEvent, useEffect, useState} from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AxiosRequestConfig } from 'axios';

import {StockConnector, StockReducerProps} from '../Reducers/StockReducer';
import StockWatcher from './StockWatcher';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';
import { StockData } from '../Types/AddStockTypes';
import { theme } from '../App';
import { PriceData } from '../Types/StockTypes';
import { green, red } from '@mui/material/colors';

class ListStockApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getQuote.bind(this);
    }
    
    public getQuote(): Promise<PriceData> {
        return this.get<PriceData>('/quote');
    }

}

const StockListItem: FunctionComponent<{ stock: StockData, expanded: string | false ,handleChange: (s : string) => any}> = ({ stock, expanded, handleChange }) => {
    const [curPrice, setCurPrice] = useState<PriceData>({ c: 0, d: 0, dp: 0});

    //websocket
    // const socket = new WebSocket('wss://ws.finnhub.io?token=c9kcp3qad3i81ufrsg9g');
    // socket.addEventListener('open', (event) => {
    //     socket.send(JSON.stringify({'type':'subscribe', 'symbol': stock.symbol}))
    // });
    // socket.addEventListener('message', (event) => {
    //     const data = JSON.parse(event.data);
    //     if(expanded === stock.symbol)
    //         setCurPrice(data['data'][0]['p']);
    // });

    useEffect(() => {
        // Get a reference to the last interval + 1
        const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);
        // Clear any timeout/interval up to that id
        for (let i = 1; i < interval_id; i++) {
        window.clearInterval(i);
        }
    },[]);

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
            getQuote();
            window.setInterval(() => {
                getQuote()
            }, 5000);
    }, [stock.symbol]);
    
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
                                    {`${curPrice.d >=0 ? '+' : ''}${curPrice.d} (${curPrice.d >=0 ? '+' : ''}${curPrice.dp})`}
                                </Typography>
                            </Box>
                        ) : null }
                        <Typography gutterBottom sx={{ color: 'text.secondary' }}>{stock.symbol}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container justifyContent={'center'}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Typography gutterBottom variant="h4" component="p">
                                    {`$${curPrice.c}`}
                                </Typography>
                                <Typography sx={{ color: curPrice.d >=0 ? green[700]: red[600] }} gutterBottom variant="h6" component="p">
                                    {`${curPrice.d >=0 ? '+' : ''}${curPrice.d} (${curPrice.d >=0 ? '+' : ''}${curPrice.dp})`}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6} md={8}>
                                {watcher}
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
    )
}

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