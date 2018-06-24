const tpls = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TPL':
            return [ action.value, ...state ];
        case 'ADD_TPLS':
            return [...state].concat([...action.value]);
        case 'UPDATE_TPLS':
            return [...action.value];
        case 'UPDATE_TPL':
            
            return [...action.value];
        default:
            return state
    }
}

export default tpls