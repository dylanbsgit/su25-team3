package com.tutorlink.backend.auth;

import com.tutorlink.backend.student.Student;
import com.tutorlink.backend.student.StudentRepository;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.tutor.TutorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TutorRepository tutorRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            String hashedPassword = passwordEncoder.encode(request.getPassword());

            if ("student".equalsIgnoreCase(request.getRole())) {
                // Check if student email already exists
                if (studentRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new AuthResponse("Email already registered as student"));
                }

                Student student = new Student(
                    request.getName(),
                    request.getEmail(),
                    hashedPassword,
                    request.getMajor()
                );
                student = studentRepository.save(student);

                String token = jwtUtil.generateToken(student.getEmail(), "student", student.getId());
                return ResponseEntity.ok(new AuthResponse(token, "student", student));

            } else if ("tutor".equalsIgnoreCase(request.getRole())) {
                // Check if tutor email already exists
                if (tutorRepository.findByEmail(request.getEmail()).isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(new AuthResponse("Email already registered as tutor"));
                }

                Tutor tutor = new Tutor(
                    request.getName(),
                    request.getEmail(),
                    hashedPassword,
                    request.getSubject()
                );
                tutor = tutorRepository.save(tutor);

                String token = jwtUtil.generateToken(tutor.getEmail(), "tutor", tutor.getId());
                return ResponseEntity.ok(new AuthResponse(token, "tutor", tutor));

            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(new AuthResponse("Invalid role. Must be 'student' or 'tutor'"));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            if ("student".equalsIgnoreCase(request.getRole())) {
                Optional<Student> studentOpt = studentRepository.findByEmail(request.getEmail());
                if (studentOpt.isPresent() && 
                    passwordEncoder.matches(request.getPassword(), studentOpt.get().getPassword())) {
                    
                    Student student = studentOpt.get();
                    String token = jwtUtil.generateToken(student.getEmail(), "student", student.getId());
                    return ResponseEntity.ok(new AuthResponse(token, "student", student));
                }

            } else if ("tutor".equalsIgnoreCase(request.getRole())) {
                Optional<Tutor> tutorOpt = tutorRepository.findByEmail(request.getEmail());
                if (tutorOpt.isPresent() && 
                    passwordEncoder.matches(request.getPassword(), tutorOpt.get().getPassword())) {
                    
                    Tutor tutor = tutorOpt.get();
                    String token = jwtUtil.generateToken(tutor.getEmail(), "tutor", tutor.getId());
                    return ResponseEntity.ok(new AuthResponse(token, "tutor", tutor));
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Invalid email, password, or role"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AuthResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestBody String token) {
        try {
            if (jwtUtil.validateToken(token)) {
                String email = jwtUtil.getEmailFromToken(token);
                String role = jwtUtil.getRoleFromToken(token);
                Long userId = jwtUtil.getUserIdFromToken(token);

                if ("student".equals(role)) {
                    Optional<Student> student = studentRepository.findById(userId);
                    if (student.isPresent()) {
                        return ResponseEntity.ok(new AuthResponse(token, role, student.get()));
                    }
                } else if ("tutor".equals(role)) {
                    Optional<Tutor> tutor = tutorRepository.findById(userId);
                    if (tutor.isPresent()) {
                        return ResponseEntity.ok(new AuthResponse(token, role, tutor.get()));
                    }
                }
            }

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Invalid token"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse("Token validation failed"));
        }
    }
}