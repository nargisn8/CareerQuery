package com.careerquery.api.service;

import com.careerquery.api.entity.Job;
import com.careerquery.api.repository.JobRepository;
import com.careerquery.api.specification.JobSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

//    public Page<Job> getFilteredJobs(String keyword, String location, String jobType, int page, int size) {
//        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
//        Specification<Job> spec = JobSpecification.getJobsByFilters(keyword, location, jobType);
//        return jobRepository.findAll(spec, pageable);
//    }

    // Köhnə halı belə ola bilər: getFilteredJobs(String k, String l, String t, int p, int s)
// Yeni halı belə olmalıdır:
    public Page<Job> getFilteredJobs(String keyword, String location, String jobType, Pageable pageable) {
        return jobRepository.findAll(JobSpecification.getJobsByFilters(keyword, location, jobType), pageable);
    }

    // Yeni iş elanı yaratmaq
    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    // Mövcud iş elanını yeniləmək
    public Job updateJob(Long id, Job jobDetails) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("İş tapılmadı: " + id));

        job.setTitle(jobDetails.getTitle());
        job.setDescription(jobDetails.getDescription());
        job.setLocation(jobDetails.getLocation());
        job.setJobType(jobDetails.getJobType());

        return jobRepository.save(job);
    }

    // İş elanını silmək
    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }
}