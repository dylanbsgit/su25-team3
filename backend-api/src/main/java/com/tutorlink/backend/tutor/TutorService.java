package com.tutorlink.backend.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class TutorService {

    @Autowired
    private TutorRepository tutorRepository;

    public Tutor findOrCreateByEmail(String email, String name) {
        return tutorRepository.findByEmail(email)
                .orElseGet(() -> {
                    Tutor tutor = new Tutor();
                    tutor.setEmail(email);
                    tutor.setName(name);
                    return tutorRepository.save(tutor);
                });
    }
}