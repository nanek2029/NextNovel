// Omar - NextNovel - Sprint 1
// Jira Task: PBI #3

// Handles backend account authentication logic.
// Registration validation is implemented here.
// Includes user registration, login, and logout.

// Registration controller
const register = async (req, res) => {
    // Extract account information from the request
    const { username, email, password } = req.body;
    // Check that all required fields were provided
    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'Username, email, password are required.'
        });
    }
    return res.status(501).json({
        message: 'Registration validate passed. Database integration pending.'
    });
};

// Export controller functions
module.exports = {
    register
};