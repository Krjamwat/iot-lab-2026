import { z } from "zod";
import { positiveIdSchema } from "./common.js";

export const studentIdParamsSchema = z.strictObject({
  id: positiveIdSchema,
});

export const studentBodySchema = z.strictObject({
  studentId: z.string().trim().min(1, "studentId is required"),
  firstName: z.string().trim().min(1, "firstName is required"),
  lastName: z.string().trim().min(1, "lastName is required"),
  birthDate: z.string().trim().min(1, "birthDate is required"),
  gender: z.string().trim().min(1, "gender is required"),
});

export const updateStudentBodySchema = studentBodySchema.partial();

