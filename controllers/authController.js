const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({ username, email, password });

        res.status(201).json({
            token: generateToken(user),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                status: user.status,
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.json({
            token: generateToken(user),
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                status: user.status,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
