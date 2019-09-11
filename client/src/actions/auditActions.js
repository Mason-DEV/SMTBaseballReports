import axios from 'axios';
import { GET_AUDITS, ADD_AUDIT, AUDITS_LOADING } from './types';


export const setAuditsLoading = () => {
    return{
        type: AUDITS_LOADING
    }
}

export const getAudits = () => dispatch => {
    dispatch(setAuditsLoading());
    axios
        .get('/api/audits')
        .then(res => 
            dispatch({
                type: GET_AUDITS,
                payload: res.data
            }))
};

export const addAudit = (audit) => dispatch => {
    axios
        .post('/api/audits', audit)
        .then(res => 
            dispatch({
                type: ADD_AUDIT,
                payload: res.data
            }))
};