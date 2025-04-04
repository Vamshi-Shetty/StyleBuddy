import NextAuth from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        Github({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await connectToDatabase();
                    const email = credentials?.email ?? "";
                    const password = credentials?.password ?? "";

                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    const isValidPassword = await bcrypt.compare(
                        credentials?.password ?? "",
                        user.password || "" // Provide a fallback or ensure it's a string
                    );
                    
                    if (!isValidPassword) {
                        throw new Error("Invalid credentials");
                    }
                    
                    return user;
                } catch (error) {
                    console.error("Error in CredentialsProvider:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            try {
                await connectToDatabase();

                if (account?.provider === "github" || account?.provider === "google") {
                    const existingUser = await User.findOne({ email: profile?.email });
                    if (!existingUser) {
                        await User.create({
                            name: profile?.name,
                            email: profile?.email,
                            
                        });
                    }
                }
                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    email: token.email,
                    name: token.name,
                    image: token.picture,
                };
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
    pages: {
        signIn: "/sign-in",
    },
    secret: process.env.NEXTAUTH_SECRET ?? "",
});

export { handler as GET, handler as POST };
