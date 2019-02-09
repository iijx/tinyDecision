const tpls = (state = [], action) => {
    switch (action.type) {
        case 'ADD_QUESTION':
            return [action.value, ...state,];
        case 'ADD_QUESTIONS':
            return [...state].concat([...action.value]);
        case 'CHANGE_QUESTIONS':
            return [...action.value]
        default:
            return state
    }
}

export default tpls