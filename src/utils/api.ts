import { AxiosRequestConfig } from "axios";
import { ThunkDispatch } from "redux-thunk";
import { WatcherActions } from "../Reducers/WatcherReducer";
import { mainState } from "../Store";

export class Api {
    protected dispatch: ThunkDispatch<mainState, unknown, WatcherActions> | undefined;
    private options: {[key: string]: any} = {}
    private config: AxiosRequestConfig;
    public constructor(config: AxiosRequestConfig, dispatch?: ThunkDispatch<mainState, unknown, WatcherActions>) {
        this.options = {
            method: config.method,
            headers: config.headers,
            mode: 'no-cors'
          };
        if (dispatch) {
            this.dispatch = dispatch;
        }
        this.config = config;
    }

    private getURI(url: string): URL {
        let uri = new URL(this.config.baseURL + url);
        let params: any|undefined = this.config.params;
        if (params) {
            for (let k in params) {
                uri.searchParams.append(k, params[k]);
            }   
        }
        return uri;
    }

    public async get<T>(url: string): Promise<T> {
        return fetch(this.getURI(url).toString())
                .then(res => {
                    console.log(res);
                    if (!res.ok) {
                        throw new Error(res.statusText)
                    }
                    return res.json() as Promise<T>
                });
    }
}