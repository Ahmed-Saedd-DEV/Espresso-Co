export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return emailPattern.test(value.trim());
}

export function isStrongPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

function formatZodIssue(issue: unknown): string {
  if (!issue || typeof issue !== 'object') {
    return '';
  }

  const zodIssue = issue as { path?: Array<string | number>; message?: string; field?: string };
  const fieldName = zodIssue.path && zodIssue.path.length > 0 ? String(zodIssue.path[zodIssue.path.length - 1]) : zodIssue.field;
  const message = zodIssue.message ?? 'Validation failed.';

  if (fieldName) {
    return `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1).replace(/[_-]+/g, ' ')} ${message.toLowerCase()}`;
  }

  return message;
}

export function normalizeErrorMessage(message?: string, payload?: unknown): string {
  if (!message && !payload) {
    return 'Something went wrong. Please try again.';
  }

  const messageText = typeof message === 'string' ? message.trim() : '';

  if (payload && typeof payload === 'object') {
    const apiPayload = payload as {
      message?: string;
      errors?: Array<{ path?: Array<string | number>; message?: string }> | Record<string, unknown>;
    };

    if (apiPayload.message && typeof apiPayload.message === 'string' && apiPayload.message !== 'Request failed.') {
      return apiPayload.message;
    }

    if (Array.isArray(apiPayload.errors) && apiPayload.errors.length > 0) {
      const issueText = apiPayload.errors.map(formatZodIssue).filter(Boolean)[0];
      if (issueText) {
        return issueText;
      }
    }

    if (apiPayload.errors && typeof apiPayload.errors === 'object') {
      const flattened = Object.values(apiPayload.errors).flatMap((entry) => {
        if (Array.isArray(entry)) {
          return entry;
        }

        return [entry];
      });

      const firstEntry = flattened[0];
      if (typeof firstEntry === 'string' && firstEntry.trim()) {
        return firstEntry.trim();
      }
    }
  }

  if (messageText) {
    try {
      const parsed = JSON.parse(messageText);
      if (parsed && typeof parsed === 'object') {
        if (typeof parsed.message === 'string' && parsed.message.trim()) {
          return parsed.message.trim();
        }

        if (Array.isArray(parsed.errors) && parsed.errors.length > 0) {
          const issueText = parsed.errors.map(formatZodIssue).filter(Boolean)[0];
          if (issueText) {
            return issueText;
          }
        }
      }
    } catch {
      // ignore malformed JSON and return plain text message
    }
  }

  return messageText || 'Something went wrong. Please try again.';
}
