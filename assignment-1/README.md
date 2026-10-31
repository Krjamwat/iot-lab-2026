# Assignment 1 - Student RESTful API (Hono + PostgreSQL)

โปรเจกต์ RESTful API สำหรับการทำ CRUD ข้อมูลนักศึกษา (Create, Read, Update, Delete) โดยอิงตามตัวอย่างที่ 2.2 ด้วย **Hono Framework**, **Drizzle ORM**, **Zod** และ **PostgreSQL** บน **Docker**

---

## ข้อมูลที่จัดเก็บ (Students Data Model)

| ฟิลด์ใน API / Code | คอลัมน์ใน Database | ชนิดข้อมูล | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `id` | `id` | `integer` (Identity) | Primary Key ของฐานข้อมูล (Auto-increment) |
| `studentId` | `student_id` | `text` (Unique) | รหัสประจำตัวนักศึกษา (เช่น `65010001`) |
| `firstName` | `first_name` | `text` | ชื่อจริงของนักศึกษา |
| `lastName` | `last_name` | `text` | นามสกุล |
| `birthDate` | `birth_date` | `text` | วันเกิด (เช่น `2003-05-15`) |
| `gender` | `gender` | `text` | เพศ (เช่น `male`, `female`, `ชาย`, `หญิง`) |

---

## ขั้นตอนการรันและการทดสอบ (Quickstart)

### 1. เปิด Docker Container สำหรับ PostgreSQL
รันคำสั่ง Docker (ตาม README ของอาจารย์):
```bash
docker run --name iot-lab-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=iot_lab \
  -p 5432:5432 \
  -d postgres:17-alpine
```

### 2. ตรวจสอบไฟล์ `.env`
ไฟล์ `.env` ถูกตั้งค่าเชื่อมต่อกับ Local PostgreSQL เรียบร้อยแล้ว:
```env
SECRET_PASSWORD=iot-lab-2026
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/iot_lab
PORT=3000
```

### 3. รัน Migration เพื่อสร้างตารางใน Database
```bash
npm run db:generate
npm run db:migrate
```

### 4. สั่งรันเซิร์ฟเวอร์
```bash
npm run dev
```
เซิร์ฟเวอร์จะเปิดทำงานที่ `http://localhost:3000`

---

## รายละเอียด Endpoint (Routes)

> **หมายเหตุ:** ทุก Request ที่ยิงไปยัง `/api/v1/*` จะต้องแนบ Header ต่อไปนี้:
> * `Authorization: Bearer iot-lab-2026`
> * `Content-Type: application/json`

| Method | Endpoint | Status Code สำเร็จ | คำอธิบาย |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/students` | `200 OK` | ดูรายชื่อนักศึกษาทั้งหมด |
| `GET` | `/api/v1/students/:id` | `200 OK` (หรือไม่พบตอบ `404`) | ดูข้อมูลนักศึกษาตาม ID ฐานข้อมูล |
| `POST` | `/api/v1/students` | `201 Created` | เพิ่มนักศึกษาใหม่ |
| `PUT` | `/api/v1/students/:id` | `200 OK` (หรือไม่พบตอบ `404`) | แก้ไขข้อมูลนักศึกษา |
| `PATCH`| `/api/v1/students/:id` | `200 OK` (หรือไม่พบตอบ `404`) | แก้ไขข้อมูลนักศึกษาบางส่วน |
| `DELETE`| `/api/v1/students/:id` | `204 No Content` (หรือไม่พบตอบ `404`) | ลบข้อมูลนักศึกษา |

---

## ตัวอย่างการทดสอบด้วย cURL

### 1. เพิ่มข้อมูลนักศึกษา (Create - POST)
```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer iot-lab-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "65010001",
    "firstName": "สมชาย",
    "lastName": "ใจดี",
    "birthDate": "2003-05-15",
    "gender": "male"
  }'
```

### 2. ดูรายชื่อนักศึกษาทั้งหมด (Read All - GET)
```bash
curl -X GET http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer iot-lab-2026"
```

### 3. ดูข้อมูลนักศึกษาตาม ID (Read One - GET)
```bash
curl -X GET http://localhost:3000/api/v1/students/1 \
  -H "Authorization: Bearer iot-lab-2026"
```

### 4. แก้ไขข้อมูลนักศึกษา (Update - PUT / PATCH)
```bash
curl -X PUT http://localhost:3000/api/v1/students/1 \
  -H "Authorization: Bearer iot-lab-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "สมศักดิ์"
  }'
```

### 5. ลบข้อมูลนักศึกษา (Delete - DELETE)
```bash
curl -X DELETE http://localhost:3000/api/v1/students/1 \
  -H "Authorization: Bearer iot-lab-2026"
```

