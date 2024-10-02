const { validateToken } = require('../services/authentication'); // Import validateToken function

function checkForAuthenticationCookie(cookieName) {
    return function (req, res, next) {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); 
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            return next(error); 
        }
        next(); 
    };
}

module.exports = {
    checkForAuthenticationCookie
};
