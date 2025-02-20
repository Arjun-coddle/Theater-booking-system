const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        if (decodedToken.role === "user") {
            req.user = decodedToken
            return next();
        };
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        })
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        })
    }
}

const verifyAdmin = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'Unauthorized'
            })
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        if (decodedToken.role === "admin") {
            req.user = decodedToken
            return next();
        };
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        })
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'Unauthorized'
        })
    }
}

module.exports = { verifyUser, verifyAdmin }