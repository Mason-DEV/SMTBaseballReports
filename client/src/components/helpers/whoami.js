var _WHO_AM_I ='';

const setWhoAmI = (who) =>{
    _WHO_AM_I = who;
}



const getWhoAmI = () => {
    return _WHO_AM_I;
}

export{
    setWhoAmI,
    getWhoAmI
}