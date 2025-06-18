package com.tutorlink.backend.auth;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.tutorlink.backend.student.Student;
import com.tutorlink.backend.tutor.Tutor;
import com.tutorlink.backend.student.StudentService;
import com.tutorlink.backend.tutor.TutorService;
import com.tutorlink.backend.auth.AuthRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private TutorService tutorService;

    @PostMapping("/google")
    public ResponseEntity<?> authenticateGoogle(@RequestBody AuthRequest request) {
        String idToken = request.getToken();
        String role = request.getRole(); // "student" or "tutor"

        if (!"student".equalsIgnoreCase(role) && !"tutor".equalsIgnoreCase(role)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid role provided");
        }

        GoogleIdToken.Payload payload = verifyGoogleToken(idToken);
        if (payload == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }

        String email = payload.getEmail();
        String name = (String) payload.get("name");

        java.util.Map<String, Object> response = new java.util.HashMap<>();

        if ("student".equalsIgnoreCase(role)) {
            Student student = studentService.findOrCreateByEmail(email, name);
            response.put("role", "student");
            response.put("user", student);
        } else {
            Tutor tutor = tutorService.findOrCreateByEmail(email, name);
            response.put("role", "tutor");
            response.put("user", tutor);
        }

        return ResponseEntity.ok(response);
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    GoogleNetHttpTransport.newTrustedTransport(),
                    JacksonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList("209053853003-aekcjsklke994e971pa0fs8p6rk928e9.apps.googleusercontent.com")) // Oauth
                .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}