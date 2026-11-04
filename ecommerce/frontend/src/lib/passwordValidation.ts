export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/

export type PasswordCheck = {
  id: string
  label: string
  met: boolean
}

export function getPasswordChecks(password: string): PasswordCheck[] {
  return [
    { id: 'length', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'lower', label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { id: 'upper', label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { id: 'digit', label: 'One number', met: /\d/.test(password) },
    {
      id: 'special',
      label: 'One special character',
      met: /[^A-Za-z0-9\s]/.test(password),
    },
  ]
}

export function isPasswordValid(password: string): boolean {
  return PASSWORD_PATTERN.test(password)
}
