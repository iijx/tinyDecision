const asyncStatus = (state = [], action) => {
    switch (action.type) {
        case 'GET_TPLS_LOADING':
            return {
                ...state,
                
            };
        case 'ADD_QUESTIONS':
            return [...state].concat([...action.value]);
        default:
            return state
    }
}

export default tpls