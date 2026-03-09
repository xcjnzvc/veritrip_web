export interface UserAccount {
  provider: string;
  providerId: string;
  id: string;
  status: string;
  loginId: string;
  // password?: string; // 보안상 생략될 수 있으므로 선택 사항
  lastLoginAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  userAccount: UserAccount;
}

// API 전체 응답 구조가 필요한 경우
export interface UserResponse {
  code: number;
  message: string;
  data: User;
}
