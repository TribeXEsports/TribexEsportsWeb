import { NextAuthOptions, DefaultSession } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import DiscordProvider from "next-auth/providers/discord"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

// Define the 5-Role hierarchy constants
export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ORGANIZER: "ORGANIZER",
  CAPTAIN: "CAPTAIN",
  PLAYER: "PLAYER",
  USER: "USER",
} as const;

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: keyof typeof USER_ROLES;
      username?: string | null;
    } & DefaultSession["user"]
  }

  interface User {
    role: string;
    username?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      checks: ['state'], // Fixed Discord App login failure by using state-only checks (prevents PKCE mismatch in new tabs)
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials")
        }

        return user as any;
      }
    })
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.userRole = (user as any).role || USER_ROLES.USER;
        token.userId = (user as any).id;
        token.userName = (user as any).username;
      }
      
      // Handle session updates (e.g. after promoting a user to Organizer or profile update)
      if (trigger === "update" && session) {
        if (session.role) token.userRole = session.role;
        if (session.user?.name) token.name = session.user.name;
        if (session.user?.image) token.picture = session.user.image;
        if (session.user?.username) token.userName = session.user.username;
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.userRole;
        (session.user as any).id = token.userId;
        (session.user as any).username = token.userName;
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
