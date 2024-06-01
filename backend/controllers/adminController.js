exports.getAdminData = async (req, res) => {
    try {
        res.json({ msg: 'This is admin data' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
