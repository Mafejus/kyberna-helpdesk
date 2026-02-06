import api from '../lib/api';
import { User } from '../context/AuthContext';

export const UsersService = {
  getAllStudents: async () => {
    // The backend endpoint is GET /users?role=STUDENT
    // based on users.controller.ts: findAll(@Query('role') role?: Role)
    const response = await api.get<User[]>('/users?role=STUDENT');
    return response.data;
  },
};
