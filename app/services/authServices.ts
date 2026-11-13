import type { User, SignInCredentials, SignUpData } from "~/types/user";
import { getApiBase } from "~/utils/api";

interface DummyJsonUser {
  id: number;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

interface DummyJsonAuthResponse extends DummyJsonUser {
  accessToken?: string;
}

/**
 * Errors thrown by the auth service carry a message that is safe to show to
 * the user, so pages do not have to translate $fetch error shapes.
 */
export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

const hasText = (value?: string) =>
  typeof value === "string" && value.trim().length > 0;

const mapUser = (raw: DummyJsonUser): User => {
  const addressParts = [
    raw.address?.address,
    raw.address?.city,
    raw.address?.postalCode,
    raw.address?.country,
  ];

  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    email: raw.email,
    phone: hasText(raw.phone) ? raw.phone : undefined,
    address:
      raw.address && addressParts.some(hasText)
        ? {
            address: raw.address.address,
            city: raw.address.city,
            postalCode: raw.address.postalCode,
            country: raw.address.country,
          }
        : undefined,
  };
};

const errorStatus = (error: unknown): number => {
  if (typeof error !== "object" || error === null) return 0;

  const value = error as {
    statusCode?: number;
    status?: number;
    response?: { status?: number };
  };

  return value.statusCode ?? value.status ?? value.response?.status ?? 0;
};

// dummyjson's login endpoint expects a username, while our form collects an
// email address. Resolve the username first, then authenticate.
const findUsernameByEmail = async (email: string): Promise<string | null> => {
  const response = await $fetch<{ users: { username: string }[] }>(
    `${getApiBase()}/users/filter`,
    {
      query: {
        key: "email",
        value: email,
        select: "username,email",
      },
    },
  );

  return response.users[0]?.username ?? null;
};

const toUsername = (email: string) => {
  const localPart = email.split("@")[0] ?? "user";
  const cleaned = localPart.replace(/[^a-z0-9._-]/gi, "").toLowerCase();

  return cleaned || `user${Date.now()}`;
};

export const signInUser = async (
  credentials: SignInCredentials,
): Promise<User> => {
  let username: string | null;

  try {
    username = await findUsernameByEmail(credentials.email);
  } catch {
    throw new AuthError(
      "We could not reach the sign-in service. Please try again.",
      503,
    );
  }

  if (!username) {
    throw new AuthError(
      "We could not find an account with that email address.",
      404,
    );
  }

  try {
    const response = await $fetch<DummyJsonAuthResponse>(
      `${getApiBase()}/auth/login`,
      {
        method: "POST",
        body: {
          username,
          password: credentials.password,
          expiresInMins: 60,
        },
      },
    );

    return mapUser(response);
  } catch (error) {
    const status = errorStatus(error);

    if (status === 400 || status === 401) {
      throw new AuthError("Incorrect email or password.", 401);
    }

    throw new AuthError(
      "We could not sign you in right now. Please try again.",
      503,
    );
  }
};

export const signUpUser = async (data: SignUpData): Promise<User> => {
  const { confirmPassword, ...registrationData } = data;

  void confirmPassword;

  try {
    const response = await $fetch<DummyJsonUser>(`${getApiBase()}/users/add`, {
      method: "POST",
      body: {
        ...registrationData,
        username: toUsername(registrationData.email),
      },
    });

    return mapUser(response);
  } catch {
    throw new AuthError(
      "We could not create your account. Please try again.",
      503,
    );
  }
};

export const signOutUser = async (): Promise<void> => {
  // dummyjson has no logout endpoint. The session lives in the browser, so
  // clearing the user store is enough.
};
