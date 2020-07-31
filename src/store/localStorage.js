/*
Cookies and local storage serve different purposes. Cookies are mainly for reading server-side, whereas local storage can only be read by the client-side. 
Apart from saving data, a big technical difference is the size of data you can store, and as I mentioned earlier localStorage gives you more to work with. 
In conclusion, the question when dealing with the two, one should ask is, in your application who needs this data- the client or the server?
*/
export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch(err) {
        console.log(err);
    }
};