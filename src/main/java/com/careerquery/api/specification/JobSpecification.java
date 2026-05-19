package com.careerquery.api.specification;

import com.careerquery.api.entity.Job;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import java.util.ArrayList;
import java.util.List;

public class JobSpecification {
    public static Specification<Job> getJobsByFilters(String keyword, String location, String jobType) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.toLowerCase().trim() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (location != null && !location.trim().isEmpty()) {
                predicates.add(cb.like(
                        cb.lower(root.get("location")),
                        "%" + location.toLowerCase().trim() + "%"
                ));
            }

            if (jobType != null && !jobType.trim().isEmpty() && !jobType.equalsIgnoreCase("All")) {
                predicates.add(cb.equal(root.get("jobType"), jobType));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}