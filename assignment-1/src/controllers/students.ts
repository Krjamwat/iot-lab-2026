import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  studentBodySchema,
  studentIdParamsSchema,
  updateStudentBodySchema,
} from "../schemas/students.js";
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent,
} from "../services/students.js";

export const studentsController = new Hono();

// GET /api/v1/students -> ดูนักศึกษาทั้งหมด (200 OK)
studentsController.get("/", async (c) => c.json(await getStudents()));

// GET /api/v1/students/:id -> ดูนักศึกษาตาม id (200 OK หรือ 404 Not Found)
studentsController.get(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const student = await getStudentById(id);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

// POST /api/v1/students -> เพิ่มนักศึกษาใหม่ (201 Created)
studentsController.post(
  "/",
  zValidator("json", studentBodySchema),
  async (c) => {
    const input = c.req.valid("json");
    const student = await createStudent(input);
    c.header("Location", `/api/v1/students/${student.id}`);
    return c.json(student, 201);
  },
);

// PUT /api/v1/students/:id -> แก้ไขข้อมูลนักศึกษา (200 OK หรือ 404 Not Found)
studentsController.put(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  zValidator("json", updateStudentBodySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const changes = c.req.valid("json");
    const student = await updateStudent(id, changes);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

// PATCH /api/v1/students/:id -> แก้ไขข้อมูลบางส่วนของนักศึกษา
studentsController.patch(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  zValidator("json", updateStudentBodySchema),
  async (c) => {
    const { id } = c.req.valid("param");
    const changes = c.req.valid("json");
    const student = await updateStudent(id, changes);

    if (!student) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.json(student);
  },
);

// DELETE /api/v1/students/:id -> ลบนักศึกษา (204 No Content หรือ 404 Not Found)
studentsController.delete(
  "/:id",
  zValidator("param", studentIdParamsSchema),
  async (c) => {
    const { id } = c.req.valid("param");

    if (!(await deleteStudent(id))) {
      return c.json({ error: "Student not found" }, 404);
    }

    return c.body(null, 204);
  },
);

