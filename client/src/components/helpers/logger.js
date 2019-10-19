import axios from 'axios';

const logger = (level, message) => {
    let log = {level: level, message: message}
    axios
    .post("/api/logger", log)
    .catch(err =>{})
}

export default logger;