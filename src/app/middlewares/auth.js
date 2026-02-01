import jwt from 'jsonwebtoken';
import authconfig from '../../config/auth.js'


const authMiddlewar = (request, response, next) => {

console.log(request.headers);

const authToken = request.headers.authorization;

if (!authToken){
    return response.status(401).json({error: "token not provides"})
}

const token = authToken.split(' ')[1];

try {
    jwt.verify(token, authconfig.sectret, (error, decoded) => {
        if (error){
            throw Error()
        }

        console.log(decoded)

        request.userId = decoded.id;
        request.userName = decoded.name
        request.UserIsAdmin = decoded.admin
    });
} catch (_error) {
    return response.status(401).json({error: "token is invalid"})
}
    return next();
};

export default authMiddlewar;
