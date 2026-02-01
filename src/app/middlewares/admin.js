
const adminMiddlewar = (request, response, next) => {

const isUserAdmin = request.UserIsAdmin



if (!isUserAdmin){
    return response.status(401).json()
}


    return next();
};

export default adminMiddlewar;
