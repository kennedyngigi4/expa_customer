import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";


export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            async authorize(credentials, req){
                try{
                    const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/account/login/`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(credentials)
                    })

                    if(!res.ok) return null;

                    const user = await res.json();
                    if (user.access){
                        return user;
                    }
                    return null;
                } catch(e){
                    return null;
                }
            }
        })
    ],

    session: {
        strategy: "jwt",
    },


    callbacks: {
        async jwt({ token, user, account }){
            if (account && user){
                token.accessToken = user?.access,
                token.id = user?.id,
                token.name = user?.name,
                token.email = user?.email
            }
            return token;
        },

        async session({ session, token }){
            session.accessToken = token?.accessToken,
            session.user.id = token?.id,
            session.user.email = token?.email,
            session.user.name = token?.name
            return session
        }
    },

    secret: process.env.AUTH_SECRET,

    pages: {
        signIn: "/auth/signin",
    }


})