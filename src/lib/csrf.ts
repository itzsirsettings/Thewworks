let csrfTokenPromise: Promise<string> | null = null;

async function requestCsrfToken() {
  const response = await fetch('/api/security/csrf-token', {
    credentials: 'same-origin',
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as {
    token?: string;
    message?: string;
  } | null;

  if (!response.ok || !payload?.token) {
    throw new Error(payload?.message || 'Unable to prepare secure request.');
  }

  return payload.token;
}

export function getCsrfToken() {
  csrfTokenPromise ??= requestCsrfToken().catch((error) => {
    csrfTokenPromise = null;
    throw error;
  });

  return csrfTokenPromise;
}

export async function getCsrfHeaders() {
  return {
    'X-XSRF-TOKEN': await getCsrfToken(),
  };
}

export function resetCsrfToken() {
  csrfTokenPromise = null;
}
