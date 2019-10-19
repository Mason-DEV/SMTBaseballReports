var _KICKBACK_REASON ='';

const setKickBack = (reason) =>{
    _KICKBACK_REASON = reason;
}



const getkickBack = () => {
    return _KICKBACK_REASON;

}

export{
    setKickBack,
    getkickBack
}