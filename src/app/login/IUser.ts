export interface IUser {
  id: string
  lastLogin: string
  tierId: string
  biography: string
  profilePicture: string
  userName: string
  normalizedUserName: string
  email: string
  normalizedEmail: string
  emailConfirmed: boolean
  passwordHash: string
  securityStamp: string
  concurrencyStamp: string
  phoneNumber: string
  phoneNumberConfirmed: boolean
  twoFactorEnabled: boolean
  lockoutEnd: string
  lockoutEnabled: boolean
  accessFailedCount: number
  tierName: string
}

export const userInitialState: IUser = {
  id: '',
  lastLogin: '',
  tierId: '',
  biography: '',
  profilePicture: '',
  userName: '',
  normalizedUserName: '',
  email: '',
  normalizedEmail: '',
  emailConfirmed: false,
  passwordHash: '',
  securityStamp: '',
  concurrencyStamp: '',
  phoneNumber: '',
  phoneNumberConfirmed: false,
  twoFactorEnabled: false,
  lockoutEnd: '',
  lockoutEnabled: false,
  accessFailedCount: 0,
  tierName: ''
}
