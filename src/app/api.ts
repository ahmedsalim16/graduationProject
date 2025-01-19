export interface Student {
    id: string;
    fullName: string;
    gender: string;
    grade: number;
    city: string;
    street: string;
    studentImg: string;
    birthDate: string | null;
  }
  
  export interface ApiResponse {
    message: string;
    result: Student[];
  }
 