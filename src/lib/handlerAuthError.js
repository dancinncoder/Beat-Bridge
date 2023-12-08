export default function getErrorContent(code) {
  switch (code) {
    case 'auth/invalid-login-credentials':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password does not match.';

    case 'auth/network-request-failed':
      return 'The network connection failed.';

    case 'auth/internal-error':
      return 'Invalid request.';

    case 'auth/email-already-exists':
    case 'auth/email-already-in-use':
      return 'The email is already in use by an existing user.';

    case 'auth/weak-password':
      return 'Passwords must be at least 6 characters long.';

    case 'auth/invalid-email':
      return 'Invalid email format.';

    case 'auth/account-exists-with-different-credential':
      return 'Cannot sign in with an email already in use, please select a different login method.';

    default:
      return 'Login failed.';
  }
}
