const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const qs = require('querystring');
const crypto = require('crypto');

const router = express.Router();


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

router.post('/airtable/pat-login', async (req, res) => {
  try {
    const pat = process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN;
    if (!pat) return res.status(400).json({ error: 'No PAT token in .env' });

    const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: { Authorization: `Bearer ${pat}` },
    });

    const airtableUser = userResponse.data;
    const userId = airtableUser.id;
    const userName = airtableUser.name || 'Airtable User';
    const userEmail = airtableUser.email || `${userId}@airtable.local`;

    let user = await User.findOne({
      $or: [{ airtableUserId: userId }, { email: userEmail }],
    });

    if (!user) {
      user = new User({
        email: userEmail,
        airtableUserId: userId,
        airtableAccessToken: pat,
        profile: { name: userName, email: userEmail },
      });
      await user.save();
    } else {
      user.airtableAccessToken = pat;
      user.profile.name = userName;
      user.profile.email = userEmail;
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, email: userEmail, name: userName, airtableUserId: userId },
    });
  } catch (error) {
    console.error('PAT login error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed PAT login' });
  }
});


router.get('/airtable', (req, res) => {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');
  const state = crypto.randomBytes(16).toString('hex');

  req.session.oauthState = state;
  req.session.codeVerifier = codeVerifier;

  const authUrl = new URL('https://airtable.com/oauth2/v1/authorize');
  authUrl.searchParams.append('client_id', process.env.AIRTABLE_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', process.env.AIRTABLE_REDIRECT_URI);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'data.records:read data.records:write schema.bases:read user.email:read');
  authUrl.searchParams.append('state', state);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');

  res.redirect(authUrl.toString());
});

router.get('/airtable/callback', async (req, res) => {
  const { code, state } = req.query;
  if (state !== req.session.oauthState) return res.status(403).json({ error: 'Invalid state' });

  try {
    const tokenResponse = await axios.post(
      'https://airtable.com/oauth2/v1/token',
      qs.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET,
        code_verifier: req.session.codeVerifier,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const airtableUser = userResponse.data;
    const userId = airtableUser.id;
    const userName = airtableUser.name || 'Airtable User';
    const userEmail = airtableUser.email || `${userId}@airtable.local`;

    let user = await User.findOne({
      $or: [{ airtableUserId: userId }, { email: userEmail }],
    });

    if (!user) {
      user = new User({
        email: userEmail,
        airtableUserId: userId,
        airtableAccessToken: accessToken,
        profile: { name: userName, email: userEmail },
      });
      await user.save();
    } else {
      user.airtableAccessToken = accessToken;
      user.profile.name = userName;
      user.profile.email = userEmail;
      await user.save();
    }

    const token = generateToken(user._id);
    res.redirect(`${process.env.CLIENT_URL}/dashboard?token=${token}`);
  } catch (error) {
    console.error('OAuth token error:', error.response?.data || error.message);
    res.status(500).json({ error: 'OAuth login failed' });
  }
});

module.exports = router;
