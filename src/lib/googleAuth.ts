/**
 * Google Identity Services (GIS) OAuth 2.0 Web Client Helper
 * Provides real Google account authentication and profile retrieval.
 */

export interface GoogleUserProfile {
  name: string;
  email: string;
  avatar?: string;
  id: string;
}

export interface GoogleAuthResult {
  isConfigured: boolean;
  user: GoogleUserProfile | null;
  error?: string;
}

export async function triggerGoogleAuth(): Promise<GoogleAuthResult> {
  const rawId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientId = rawId ? rawId.trim().replace(/^["']|["']$/g, "").trim() : "";

  // If Client ID is not yet provided by the developer
  if (!clientId) {
    return {
      isConfigured: false,
      user: null,
      error: "MISSING_CLIENT_ID",
    };
  }

  // Ensure Google Identity Services script is available in browser
  if (typeof window === "undefined") {
    throw new Error("Google authentication can only run in the browser.");
  }

  const google = (window as any).google;
  if (!google?.accounts?.oauth2) {
    throw new Error(
      "Google Sign-In SDK is still loading. Please try again in a few seconds."
    );
  }

  return new Promise((resolve, reject) => {
    try {
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse.error) {
            return reject(new Error(tokenResponse.error_description || tokenResponse.error));
          }

          if (!tokenResponse.access_token) {
            return reject(new Error("No access token returned by Google."));
          }

          try {
            // Fetch the authenticated user's real profile from Google's UserInfo API
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: {
                Authorization: `Bearer ${tokenResponse.access_token}`,
              },
            });

            if (!res.ok) {
              throw new Error(`Failed to fetch userinfo from Google: ${res.status}`);
            }

            const profile = await res.json();

            resolve({
              isConfigured: true,
              user: {
                name: profile.name || profile.given_name || "Google User",
                email: profile.email,
                avatar: profile.picture,
                id: profile.sub,
              },
            });
          } catch (err: any) {
            reject(err);
          }
        },
        error_callback: (err: any) => {
          reject(new Error(err?.message || "Google OAuth window closed or blocked."));
        },
      });

      // Open Google account picker popup
      client.requestAccessToken({ prompt: "select_account" });
    } catch (err: any) {
      reject(err);
    }
  });
}
