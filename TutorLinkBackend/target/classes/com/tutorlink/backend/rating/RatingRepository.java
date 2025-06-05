package com.tutorlink.backend.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByTutor_Id(Long tutorId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.tutor.id = :tutorId")
Double findAverageRatingByTutorId(@Param("tutorId") Long tutorId);
}