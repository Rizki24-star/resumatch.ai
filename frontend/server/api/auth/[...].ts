import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import type { Session } from "next-auth";

// Extend Session type
interface ExtendedSession extends Session {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
  };
}

type AuthResponse = {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
    };
    token: string;
  };
};

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,

  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("Google auth successful:", user);

        const config = useRuntimeConfig();
        const baseApiUrl = config.public.apiBase || "http://localhost:3001";

        const response: AuthResponse = await $fetch(
          `${baseApiUrl}/user-auth/google`,
          {
            method: "POST",
            body: {
              email: user.email,
              name: user.name,
              picture: user.image,
              googleId: account?.providerAccountId || profile?.sub,
            },
          }
        );

        console.log("Backend response:", response);

        if (!response.success) {
          console.error("Backend auth failed:", response);
          return false;
        }

        return true;
      } catch (error) {
        console.error("Sign-in error:", error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const config = useRuntimeConfig();
          const baseApiUrl = config.public.apiBase || "http://localhost:3001";

          const response: AuthResponse = await $fetch(
            `${baseApiUrl}/user-auth/google`,
            {
              method: "POST",
              body: {
                email: profile.email,
                name: profile.name,
                picture: profile.image,
                googleId: profile.sub,
              },
            }
          );

          if (response.success) {
            token.backendToken = response.data.token;
            token.userId = response.data.user.id;
          }
        } catch (error) {
          console.error("JWT callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      const extendedSession = session as ExtendedSession;

      if (token && extendedSession.user) {
        extendedSession.user.id = token.userId as string;
        extendedSession.token = token.backendToken as string;
      }

      return extendedSession;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url === baseUrl) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },
});
