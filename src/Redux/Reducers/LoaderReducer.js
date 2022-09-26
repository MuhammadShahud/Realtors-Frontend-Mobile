/* eslint-disable prettier/prettier */
import { LOADER_TRUE, LOADER_FALSE } from '../action_types';

const initialState = {
    Loading: false,
};

export default function LoaderReducer(state = initialState, action) {
    switch (action.type) {
        case LOADER_TRUE:
            state = {
                Loading: true,
            };
            break;
        case LOADER_FALSE:
            state = {
                Loading: false,
            };
            break;
        default:
            break;
    }
    return state;
}
