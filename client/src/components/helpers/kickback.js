var _KICKBACK_REASON ='';

const setKickBack = (reason) =>{
    console.log("setKick", reason);
    _KICKBACK_REASON = reason;
}



const getkickBack = () => {
    console.log("getKick", _KICKBACK_REASON);
    return _KICKBACK_REASON;

}

export{
    setKickBack,
    getkickBack
}