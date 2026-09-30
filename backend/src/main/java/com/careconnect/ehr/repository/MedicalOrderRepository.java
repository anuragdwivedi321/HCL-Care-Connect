package com.careconnect.ehr.repository;

import com.careconnect.ehr.entity.MedicalOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalOrderRepository extends JpaRepository<MedicalOrder, Long> {
    List<MedicalOrder> findByPatientIdOrderByOrderedAtDesc(Long patientId);
    List<MedicalOrder> findByProviderIdOrderByOrderedAtDesc(Long providerId);
    List<MedicalOrder> findByStatus(String status);
    long countByStatus(String status);
}
