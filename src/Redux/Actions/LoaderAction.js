/* eslint-disable prettier/prettier */
import { LOADER_TRUE, LOADER_FALSE } from '../action_types';


export default class LoaderAction {
    static LoaderTrue() {
        return {
            type: LOADER_TRUE,
        };
    }
    static LoaderFalse() {
        return {
            type: LOADER_FALSE,
        };
    }
};
