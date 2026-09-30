package com.careconnect.ehr.repository;

import com.careconnect.ehr.entity.ClinicalEncounter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClinicalEncounterRepository extends JpaRepository<ClinicalEncounter, Long> {
    List<ClinicalEncounter> findByPatientIdOrderByEncounterDateDesc(Long patientId);
    List<ClinicalEncounter> findByProviderIdOrderByEncounterDateDesc(Long providerId);
    long countByStatus(String status);
}
