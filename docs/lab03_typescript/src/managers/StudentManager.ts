import { Student } from "../models/Student.js";

export class StudentManager {
  private students: Student[] = [];

  addStudent(student: Student): void {
    this.students.push(student);
    this.saveToLocalStorage();
  }

  getAllStudents(): Student[] {
    return this.students;
  }

  findStudentByID(id: string): Student | undefined {
    return this.students.find((s) => s.id === id);
  }

 
  // ค้นหาจาก ชื่อจริง หรือ นามสกุล
  findStudentsByName(name: string): Student[] {
    const keyword = name.toLowerCase();
    return this.students.filter(
      (s) =>
        s.first_name.toLowerCase().includes(keyword) ||
        s.last_name.toLowerCase().includes(keyword)
    );
  }

  // ค้นหานักศึกษาจาก Email
  findStudentByEmail(email: string): Student | undefined {
    
    return this.students.find(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
  }

  findStudentsByMajor(major: string): Student[] {
    return this.students.filter((s) =>
      s.major.toLowerCase().includes(major.toLowerCase())
    );
  }

  saveToLocalStorage(): void {
    localStorage.setItem("students", JSON.stringify(this.students));
  }

  loadFromLocalStorage(): void {
    const data = localStorage.getItem("students");
    if (data) {
      this.students = JSON.parse(data);
    }
  }
}