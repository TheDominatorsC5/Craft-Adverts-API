import jwt from "jsonwebtoken"

export const identifier = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
    
        if (!token) {
            return res.status(401).json({success: false, message: 'authentication not found'})
        }
        
        const userToken = token.split(' ')[1];
        const jwtVerified = jwt.verify(userToken, process.env.TOKEN_SECRET);
        
        if (jwtVerified) {
            req.user = jwtVerified;
            next();
        } else {
            throw new Error('error in the token')
        }
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message})
    }

}
