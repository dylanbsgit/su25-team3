# Software Requirements Specification
## For TutorLink

Version 0.1  
Prepared by Dylan Soto, Terrance Lee 

CSC 340  
26 MAY 2025 

Table of Contents
=================
* [Revision History](#revision-history)
* 1 [Introduction](#1-introduction)
  * 1.1 [Document Purpose](#11-document-purpose)
  * 1.2 [Product Scope](#12-product-scope)
  * 1.3 [Definitions, Acronyms and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  * 1.4 [References](#14-references)
  * 1.5 [Document Overview](#15-document-overview)
* 2 [Product Overview](#2-product-overview)
  * 2.1 [Product Functions](#21-product-functions)
  * 2.2 [Product Constraints](#22-product-constraints)
  * 2.3 [User Characteristics](#23-user-characteristics)
  * 2.4 [Assumptions and Dependencies](#24-assumptions-and-dependencies)
* 3 [Requirements](#3-requirements)
  * 3.1 [Functional Requirements](#31-functional-requirements)
    * 3.1.1 [User Interfaces](#311-user-interfaces)
    * 3.1.2 [Hardware Interfaces](#312-hardware-interfaces)
    * 3.1.3 [Software Interfaces](#313-software-interfaces)
  * 3.2 [Non-Functional Requirements](#32-non-functional-requirements)
    * 3.2.1 [Performance](#321-performance)
    * 3.2.2 [Security](#322-security)
    * 3.2.3 [Reliability](#323-reliability)
    * 3.2.4 [Availability](#324-availability)
    * 3.2.5 [Compliance](#325-compliance)
    * 3.2.6 [Cost](#326-cost)
    * 3.2.7 [Deadline](#327-deadline)

## Revision History
| Name | Date    | Reason For Changes  | Version   |
| ---- | ------- | ------------------- | --------- |
| Dylan & Terrance |  26 May | Initial SRS         | 1.0       |
|      |         |                     |           |
|      |         |                     |           |

## 1. Introduction

### 1.1 Document Purpose
The purpose of this Software Requirements Document (SRD) is to describe the client-view and developer-view requirements for the TutorLink application.
Client-oriented requirements describe the system from the client’s perspective. These requirements include a description of the different types of users served by the system.
Provider-oriented requirements describe the system from a software Provider's perspective. These requirements include a detailed description of functional, data, performance, and other important requirements.

### 1.2 Product Scope
TutorLink is a web-based application designed to help students connect with qualified academic tutors based on specific class subjects. The system provides a platform where students can create profiles, browse a list of available tutors by course or topic, schedule tutoring sessions, and leave reviews after sessions. Tutors can register on the platform, create service listings for the subjects they specialize in, manage their availability, and interact with student feedback.

This version of the system will focus on two primary user roles: Student (Customer) and  Tutor (Provider) Each role will have dedicated functionalities that support their specific needs.

### 1.3 Definitions, Acronyms and Abbreviations                                                                                                                                            
| Reference  | Definition                                                                                                                                                                         |
|------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Java       | A programming language originally developed by James Gosling at Sun Microsystems. We will be using this language to build Class Connect.                                           |
| HTML       | Hypertext Markup Language. This is the code that will be used to structure and design the web application and its content.                                                         |
| CSS        | Cascading Style Sheets. Will be used to add styles and appearance to the web app.                                                                                                  |
| API        | Application Programming Interface. This will be used to interface the backend and the fronted of our application.                                                                  |
| JavaScript | An object-oriented computer programming language commonly used to create interactive effects within web browsers.Will be used in conjuction with HTML and CSS to make the web app. |
| VS Code    | An integrated development environment (IDE) for Java. This is where our system will be created.                                                                                    |
| SpringBoot | An open-source Java-based framework used to create a micro Service. This will be used to create and run our application.                                                           |
| Spring MVC | Model-View-Controller. This is the architectural pattern that will be used to implement our system.                                                                                |
| Spring Web | Will be used to build our web application by using Spring MVC. This is one of the dependencies of our system.                                                                      |
| Postgresql | Open-source relational database management system.                                                                                                                                 |
|            |                                                                                                                                                                                    |

### 1.4 References
https://spring.io/guides

### 1.5 Document Overview
Section 1 - General introduction to the document - Intended for any reader

Section 2 - The product and its features - Intended for customers

Section 3 - Specifies requirements and constraints for the product and development process - Intended for the dev team

## 2. Product Overview
TutorLink is a clean, accessible web application designed to help students find academic support through one-on-one tutoring. The platform connects students who need help in specific classes with tutors who are qualified to teach those subjects. Students can search for tutors by course, view their availability, and schedule sessions based on their needs. The goal of TutorLink is to make finding academic help easy, fast, and relaiable, weather its for a last minute exam prep or long term subject improvement

### 2.1 Product Functions
TutorLink allows tutors to create and customize which subjects they cover. Tutors can mange and moderate their schedule and availability in a natural and intuitive way. Students can look for and join any tutoring session based off of the tutor's availability; they can also easily manage any scheduled sessions from their dashboard.

### 2.2 Product Constraints
At this stage, Tutor Link  is still in the conceptual and design phase, and development is limited by both time and technical scope. The current plan is to build the application using:
- A web interface written in HTML, CSS, and JavaScript
- A backend written in Java using a RESTful API structure
-  A PostgreSQL database for data storage, likely using a free hosting option

Due to time constraints and resource limits, the team may need to scale back features such as real-time messaging, advanced filtering, or admin dashboards. In its early stages, the application will likely only be accessible on desktop web browsers, with mobile optimization planned for a future version.

Additionally, access to third-party APIs may be restricted to free-tier usage limits, which could affect functionality like mapping or login services.
  
### 2.3 User Characteristics
Our web app expects users to have a very basic level of computer knowledge, to include using a web browser. That being said, the web app will attempt to maintain a level of simplicity such that, as long as users know which subject they would like to receive tutoring, they can master usage of the web app rapidly.

### 2.4 Assumptions and Dependencies
The development of TutorLink is based on several technical assumptions and external dependencies that may affect functionality and integration. The following assumptions and dependencies have been identified:
- The application will be developed using Java, with support from Spring and Spring Boot frameworks to handle backend logic and RESTful web services.
- VS Code will be the primary development environment.
- The system will rely on REST APIs to connect to third-party service
- A PostgreSQL database will be used for persistent storage.
- The project assumes access to a stable internet connection for all API calls and user interactions.
- The system will be hosted and managed through GitHub, and development tasks will be tracked using GitHub issues and commits.

## 3. Requirements

### 3.1 Functional Requirements 
- FR0: The system shall allow users to create accounts as either a student or a tutor.
   - Each account shall have a unique identifier assigned at the time of creation.
- FR1: The system shall allow tutors to create a new subject listing by providing details including:
   - Subject, Schedule (day/time), and location (online or in-person)
- FR2: The system shall allow students to browse the list of available tutors using filters such as subject, availability, and tutor rating.
- FR3: The system shall allow students to drop or cancel their tutor session up to (1) hour before the session begins.
- FR4: The system shall allow tutors to cancel their tutor session at any time as long as a reason is provided.
- FR5: The system shall allow all users to be able to view/modify their profile at any time to include:
   - Updating personal information, profile pictures, etc.
- FR6: The system shall allow students to leave ratings/written review for the tutoring sessions they attend.

#### 3.1.1 User interfaces
Web pages using HTML, CSS, and JavaScript.

#### 3.1.2 Hardware interfaces
Devices that have web browsing capabilities.

#### 3.1.3 Software interfaces
- Java jdk 21
- PostgreSQL 17
- SpringBoot 3.4.5
  
### 3.2 Non Functional Requirements 

#### 3.2.1 Performance
- NFR0: The TutorLink system shall operate within a memory footprint of less than 250MB during normal usage.
- NFR1: A novice user (someone unfamiliar with the system) shall be able to register, log in, and create or manage a tutor session within 5 minutes of use.
- NFR2: An experienced user shall be able to log in and complete common tasks such as creating or modifying a tutor session listing within 1 minute. 

#### 3.2.2 Security
- NFR3: The system is going to be available only to authorized users, using their username and password

#### 3.2.3 Reliability

#### 3.2.4 Availability

#### 3.2.5 Compliance

#### 3.2.6 Cost
- NFR5: We expect to sepnd $0.00 on this project

#### 3.2.7 Deadline
- NFR6: The final product must be delivered on June 18th
