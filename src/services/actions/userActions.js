export const SET_USER_DATA = "SET_USER_DATA"

export const setUser = (dados) => async(dispatch, getState) => {
    return dispatch(
        {
            type: SET_USER_DATA,
            payload: dados
        }
    )
}