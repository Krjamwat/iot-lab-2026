import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { students, type NewStudent, type Student } from "../db/schema.js";

export type StudentInput = Omit<NewStudent, "id">;
export type StudentChanges = Partial<StudentInput>;

// 1. ดึงข้อมูลนักศึกษาทั้งหมด
export async function getStudents(): Promise<Student[]> {
  return db.select().from(students);
}

// 2. ดึงข้อมูลนักศึกษาคนเดียวตาม id
export async function getStudentById(id: number): Promise<Student | undefined> {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.id, id))
    .limit(1);

  return student;
}

// 3. เพิ่มข้อมูลนักศึกษาใหม่
export async function createStudent(input: StudentInput): Promise<Student> {
  const [student] = await db.insert(students).values(input).returning();

  if (!student) {
    throw new Error("Created student was not returned");
  }

  return student;
}

// 4. แก้ไขข้อมูลนักศึกษา
export async function updateStudent(
  id: number,
  changes: StudentChanges,
): Promise<Student | undefined> {
  const [student] = await db
    .update(students)
    .set(changes)
    .where(eq(students.id, id))
    .returning();

  return student;
}

// 5. ลบข้อมูลนักศึกษา
export async function deleteStudent(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(students)
    .where(eq(students.id, id))
    .returning({ id: students.id });

  return deleted !== undefined;
}

