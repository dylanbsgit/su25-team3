# Tutor Link - Software Design

Version 1  
Tutor Link Team  
June 5, 2025

---

## Table of Contents
* [Revision History](#revision-history)
* 1 [Product Overview](#1-product-overview)
* 2 [Use Cases](#2-use-cases)
  * 2.1 [Use Case Model](#21-use-case-model)
  * 2.2 [Use Case Descriptions](#22-use-case-descriptions)
    * 2.2.1 [Actor: Student](#221-actor-student)
    * 2.2.2 [Actor: Tutor](#222-actor-tutor)
* 3 [UML Class Diagram](#3-uml-class-diagram)
* 4 [Database Schema](#4-database-schema)

---

## Revision History
| Name          | Date  | Reason For Changes     | Version |
|---------------|-------|------------------------|---------|
| Terrance Lee  | 6/5   | Initial Design Upload  | 1.0     |

---

## 1. Product Overview
Tutor Link is a web-based platform that allows students to search for tutors based on academic subjects and schedule tutoring appointments. Tutors can list their available subjects, manage appointments, and receive feedback from students. The platform also features a messaging system to allow direct communication between students and tutors.

---

## 2. Use Cases

### 2.1 Use Case Model
![image](https://github.com/user-attachments/assets/bfb0f39f-61fb-4b25-8841-202efc91adc5)


### 2.2 Use Case Descriptions

#### 2.2.1 Actor: Student

- **Create Account**: A student can create an account by entering name, email, and password.
- **Search for Tutor**: Students can search for available tutors by subject and level.
- **Schedule Session**: Students can book appointments with a tutor based on their availability.
- **Leave Review**: After a session, a student can rate a tutor and leave comments.
- **View Messages**: Students can view conversation threads and messages shared with tutors.

#### 2.2.2 Actor: Tutor

- **Create Account**: Tutors can register with a profile that includes their name, email, and areas of expertise.
- **Add Subjects**: Tutors can select and manage subjects they are qualified to teach.
- **Set Availability & Rates**: Tutors can define their available times and session rates.
- **Manage Tutoring Sessions**: Tutors can accept, cancel, or reschedule appointments.
- **View Messages**: Tutors can engage in threaded conversations with students.

---

## 3. UML Class Diagram
![image](https://github.com/user-attachments/assets/27dd6fe1-25a0-49e8-8b61-93fc3f78cb5e)

---

## 4. Database Schema
![image](https://github.com/user-attachments/assets/f77d5d12-b817-45de-b3e6-ab0081c44a24)

The schema includes the following tables:

### `students`
- `student_id`
- `name`
- `email`
- `major`
- `password`

### `tutors`
- `tutor_id`
- `name`
- `email`
- `rating`
- `availability`

### `subjects`
- `subject_id` 
- `name`
- `category` 
- `level` 

### `tutor_subjects`
- `id` 
- `tutor_id` 
- `subject_id` 

### `appointments`
- `appt_id` 
- `student_id` 
- `tutor_id` 
- `subject_id` 
- `date_time`
- `location`
- `status` 

### `ratings`
- `rating_id` 
- `student_id` 
- `tutor_id` 
- `rating` 
- `comment`
- `created_at`

### `conversation_threads`
- `thread_id` 
- `student_id` 
- `tutor_id` 
- `subject_id` 
- `created_at`

### `messages`
- `message_id` 
- `thread_id` 
- `sender_id` 
- `timestamp`
- `content`

This schema supports the functional requirements and use cases defined in the project overview and diagrams with the exception of messages & conversation_threads, application pendin. 
