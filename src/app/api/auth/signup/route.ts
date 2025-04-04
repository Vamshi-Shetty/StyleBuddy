import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import User from '@/models/user';
import connectToDatabase from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        const { name, email, password, confirmPassword } = await request.json();

        // Email validation
        const isValidEmail = (email: string) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Password validation
        const isValidPassword = (password: string) => {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
            return passwordRegex.test(password);
        };

        // Field checks
        if (!name || !email || !password || !confirmPassword) {
            return NextResponse.json(
                { message: 'All fields are required' },
                { status: 400 }
            );
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return NextResponse.json(
                { message: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Confirm passwords match
        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: 'Passwords do not match' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (!isValidPassword(password)) {
            return NextResponse.json(
                {
                    message:
                        'Password must be at least 6 characters long and include at least one letter and one number',
                },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            name,
            password: hashedPassword,
        });
        await newUser.save();

        // Redirect to sign-in page
        return NextResponse.json(
            {
                message: 'User created successfully. Redirecting to sign-in...',
                redirectTo: '/signin',
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Error creating user:', error.message || error);
        return NextResponse.json(
            { message: 'Something went wrong. Please try again later.' },
            { status: 500 }
        );
    }
}