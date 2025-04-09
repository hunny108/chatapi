const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const { status } = req.body;
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { status },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
