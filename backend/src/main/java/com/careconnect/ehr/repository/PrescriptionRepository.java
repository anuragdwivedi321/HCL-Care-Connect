package com.careconnect.ehr.repository;

import com.careconnect.ehr.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);
    List<Prescription> findByPatientIdAndStatus(Long patientId, String status);
    List<Prescription> findByProviderIdOrderByPrescribedAtDesc(Long providerId);
    long countByStatus(String status);
}
