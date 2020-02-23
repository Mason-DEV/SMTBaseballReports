import axios from 'axios';
import {getJwt} from '../helpers/jwt'
import APIHelper from "../helpers/APIHelper";


const logger = (level, message) => {
    let log = {level: level, message: message}
    axios
    .post(APIHelper.loggerAPI, log,  { headers: { Authorization: `Bearer ${getJwt()}` } })
    .catch(err =>{})
}

export default logger;