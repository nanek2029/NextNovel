const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshSession = require('../models/refreshSession');

const ACCESS_TOKEN_LIFETIME = '15m';
const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

const getAccessSecret = () => process.env.JWT_ACCESS_SECRET;
const getIssuer = () => process.env.JWT_ISSUER || 'nextnovel';

const hashRefreshToken = (token) =>
    crypto.createHash('sha256').update(token).digest('hex');

const createAccessToken = (user) => {
    if (!getAccessSecret()) {
        throw new Error('JWT_ACCESS_SECRET is not configured.');
    }

    return jwt.sign(
        {
            sub: user._id.toString(),
            username: user.username,
            role: user.role,
            typ: 'access'
        },
        getAccessSecret(),
        {
            expiresIn: ACCESS_TOKEN_LIFETIME,
            issuer: getIssuer(),
            audience: 'nextnovel-client'
        }
    );
};

const createRefreshSession = async (user) => {
    const rawToken = crypto.randomBytes(48).toString('base64url');
    const familyId = crypto.randomUUID();

    await RefreshSession.create({
        userId: user._id,
        tokenHash: hashRefreshToken(rawToken),
        familyId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS),
        revokedAt: null
    });

    return rawToken;
};

const rotateRefreshSession = async (session) => {
    const rawToken = crypto.randomBytes(48).toString('base64url');

    session.revokedAt = new Date();
    await session.save();

    await RefreshSession.create({
        userId: session.userId,
        tokenHash: hashRefreshToken(rawToken),
        familyId: session.familyId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_LIFETIME_MS),
        revokedAt: null
    });

    return rawToken;
};

const revokeRefreshFamily = async (familyId) =>
    RefreshSession.updateMany(
        { familyId, revokedAt: null },
        { $set: { revokedAt: new Date() } }
    );

const revokeUserRefreshSessions = async (userId) =>
    RefreshSession.updateMany(
        { userId, revokedAt: null },
        { $set: { revokedAt: new Date() } }
    );

const setRefreshCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/auth',
        maxAge: REFRESH_TOKEN_LIFETIME_MS
    });
};

const clearRefreshCookie = (res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/api/auth'
    });
};

module.exports = {
    createAccessToken,
    createRefreshSession,
    rotateRefreshSession,
    revokeRefreshFamily,
    revokeUserRefreshSessions,
    setRefreshCookie,
    clearRefreshCookie,
    hashRefreshToken,
    getAccessSecret,
    getIssuer
};
