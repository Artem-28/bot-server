export interface User {
  /** Идентификатор пользователя */
  id?: number;

  /** Email пользователя */
  email: string;

  /** Пароль пользователя */
  password: string;

  /** Телефон пользователя */
  phone: string | null;

  /** Согласие на персональне данные */
  licenseAgreement: boolean;

  /** Дата подтверждение email */
  emailVerifiedAt: Date | null;

  /** Дата подтверждения телефона */
  phoneVerifiedAt: Date | null;

  /** Дата последней активности пользователя */
  lastActiveAt: Date | null;

  /** Дата создания пользователя */
  createdAt: Date;

  /** Дата обновления пользователя */
  updatedAt: Date;
}
