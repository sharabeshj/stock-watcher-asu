import { Fragment, FunctionComponent, useEffect, useState } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Paper, Button, styled, Autocomplete, TextField, CircularProgress, createFilterOptions, Grid, Stack } from '@mui/material';

import { StockData } from '../Types/AddStockTypes';
import {StockReducerProps, StockConnector} from '../Reducers/StockReducer';
import { Api } from '../utils/api';
import { apiConfig } from '../utils/api.config';

const Item = styled(Paper)(({ theme }) => ({
    margin: theme.spacing(2),
    padding: theme.spacing(3)
}))

class AddStocksApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);
        this.getStocks.bind(this);
    }

    public getStocks(): Promise<StockData[]> {
        return this.get<StockData[]>('/stock/symbol');
    }
}

const AddStock: FunctionComponent<StockReducerProps> = ({ add_stock, clear_stock }) => {
    const initSaveData = {
        currency: "",
        description: "",
        displaySymbol: "",
        figi: "",
        mic: "",
        symbol: "",
        type: "",
    }

    const [open, setOpen] = useState<boolean>(false);
    const [stockOption, setStockOption] = useState<StockData[]>([]);
    const [saveData, setSaveData] = useState<StockData>(initSaveData);
    const [dataLoading, setDataLoading] = useState<boolean>(false);

    const loading = open && stockOption.length === 0;
    

    useEffect(() => {
        if(dataLoading)
        {
            const getStocksApi = new AddStocksApi({
                ...apiConfig,
                params: {
                    ...apiConfig.params,
                    exchange: "US",
                }
            });
            setDataLoading(false)
            getStocksApi.getStocks()
                .then(d => {
                    setStockOption(d);
                });
            }
    }, [dataLoading]);

    useEffect(() => {
        if(loading) {
            if(loading) setDataLoading(true);
        }
    }, [loading])

    const handleSubmit = () => {
        add_stock(saveData);
        setSaveData(initSaveData);
    }

    return (
        <Item>
            <form noValidate autoComplete='off'>
                <Grid container justifyContent={"center"} alignItems={'center'} spacing={2}>
                    <Grid item md={8} xs={12}>
                            <Autocomplete
                                    fullWidth
                                    disablePortal
                                    id="searchSymbol"
                                    open={open}
                                    onOpen={() => setOpen(true)}
                                    onClose={() => setOpen(false)}
                                    isOptionEqualToValue={(option,value) => option.symbol === value.symbol}
                                    renderInput={(params) => (
                                        <TextField 
                                            label={"Stock"} 
                                            placeholder={"Search Stock"} 
                                            {...params}
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <Fragment>
                                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </Fragment>
                                                )
                                            }}
                                            />
                                            )}
                                    options={stockOption}
                                    loading={loading}
                                    getOptionLabel={(option) => option.symbol !== '' ? `${option.displaySymbol} - ${option.description}` : ''}
                                    filterOptions={createFilterOptions({ limit: 1000 })}
                                    onChange={(e, value) => { if (value) setSaveData(value) }}
                                    value={saveData}
                                />
                        </Grid>
                        <Grid item xs={4}>
                            <Stack direction={"row"} spacing={2}>
                                <Button variant="contained" onClick={() => handleSubmit()}>Add to Watchlist</Button>
                                <Button variant='outlined' onClick={() => clear_stock() }>Clear All</Button>
                            </Stack>
                        </Grid>
                </Grid>
            </form>
        </Item>
    );
}

export default StockConnector(AddStock);