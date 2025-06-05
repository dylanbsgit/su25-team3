package com.tutorlink.backend.tutor;

import com.tutorlink.backend.tutor.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TutorRepository extends JpaRepository<Tutor, Long> {
    List<Tutor> findBySubjects_Subject_Id(Long subjectId);
}