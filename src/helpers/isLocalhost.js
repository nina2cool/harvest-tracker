const isLocalHost = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' || 
           window.location.hostname === '::1'; // For IPv6 localhost
};

export default isLocalHost;