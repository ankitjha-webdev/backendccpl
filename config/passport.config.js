const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/sequalize.config');
const CustomError = require('../utils/CustomError');

module.exports = function(passport) {
    passport.use(
        new JWTStrategy(
            {
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                passReqToCallback: true
            },
           async function(req, jwt_payload, next) {
                const user = await db.users.findOne({ where: { id: jwt_payload.id } });
                if (!user && user.email !== process.env.ADMIN_EMAIL) {
                    return next(new CustomError('Unauthorized Access not allowed.', 401));
                }
                next(null, user);
            }
        )
    )
}