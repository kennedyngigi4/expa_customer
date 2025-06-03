import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        access?: string;
        id?: string;
        email?: string;
        name?: string;
    }

    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
        };
    }
}