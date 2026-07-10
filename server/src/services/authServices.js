const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

exports.registerUser = async (userData) => {
    const { email, password, name } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const emailExists = await prisma.user.findUnique({ where: { email } });
    if (emailExists) {
        throw new Error('Email already exists');
    }
    const existingUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'USER'  // Assigning default role as USER
        }
    });
    return { message: 'User registered successfully', user: { name: existingUser.name, email: existingUser.email } };
};

exports.loginUser = async (userData) => {
    const { email, password } = userData;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.accessToken(user);
    return {
        message: 'Login successful',
        token
    };
};

exports.getProfile = async (userId) => {
    const parsedUserId = Number(userId);

    if (!Number.isInteger(parsedUserId)) {
        throw new Error('Valid user ID is required');
    }

    const user = await prisma.user.findUnique({
        where: { id: parsedUserId },
        select: { name: true, email: true }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};
