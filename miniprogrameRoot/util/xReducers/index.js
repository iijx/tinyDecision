

import tpls from './tpls.js';
import questions from './questions.js'

const combineReducers = ( reducers ) => {
    const reducerKeys = Object.keys(reducers);

    return function combination(state={}, action) {
        let hasChange = false;
        const nextState = {};
        for ( let i = 0; i < reducerKeys.length; i++ ) {
            let curKey = reducerKeys[i];
            let curReducer = reducers[curKey];
            let previousStateForKey = state[curKey];

            let nextStateForKey = curReducer(previousStateForKey, action);
            nextState[curKey] = nextStateForKey;
            hasChange = nextStateForKey === previousStateForKey ? false : true;
        
        }
        // console.log(hasChange, nextState);
        // return hasChange ? nextState : state;
        return nextState;
    } 
}
const a = combineReducers({
    tpls,
    questions,
})

export default a;
