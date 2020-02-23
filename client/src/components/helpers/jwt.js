const getJwt = () => {
    return localStorage.getItem('smt-jwt');
}

export{
    getJwt,
   
}