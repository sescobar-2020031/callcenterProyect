export const getIdentity = () => {
    const globalIdentity = localStorage.getItem('identity');
    let identity;
    if(globalIdentity != undefined){
        identity = JSON.parse(globalIdentity);
    } else {
        identity = '';
    }
    return identity;
};

export default getIdentity;