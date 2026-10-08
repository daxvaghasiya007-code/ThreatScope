import bcrypt from 'bcrypt';

const users = [
    {
        name: 'Admin User',
        email: 'admin@threatscope.com',
        password: 'password123', // This Will Be Hashed
        isAdmin: true,
    },
    {
        name: 'Guest Agent',
        email: 'agent@threatscope.com',
        password: 'password123',
        isAdmin: false,
    },
];

// Note: Because insertMany() bypasses the 'pre-save' middleware in some versions,
// We manually hash passwords here to be safe.
const hashPasswords = async () => {
    for (let user of users) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
};

// We execute the hashing immediately before export
await hashPasswords();

export default users;