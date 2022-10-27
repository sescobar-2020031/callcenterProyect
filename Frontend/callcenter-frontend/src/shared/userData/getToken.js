export const getToken = () => {
    const globalToken = localStorage.getItem('token');
    let token;
    if(globalToken !== undefined){
        token = globalToken;
    } else {
        token = '';
    }
    return token;
}
export default getToken;