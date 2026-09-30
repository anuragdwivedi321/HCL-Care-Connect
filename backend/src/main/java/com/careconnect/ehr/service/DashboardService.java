package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.DashboardStatsDto;
import com.careconnect.ehr.repository.ClinicalEncounterRepository;
import com.careconnect.ehr.repository.MedicalOrderRepository;
import com.careconnect.ehr.repository.PatientRepository;
import com.careconnect.ehr.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final PatientRepository patientRepository;
    private final ClinicalEncounterRepository encounterRepository;
    private final MedicalOrderRepository orderRepository;
    private final PrescriptionRepository prescriptionRepository;

    public DashboardService(PatientRepository patientRepository,
                            ClinicalEncounterRepository encounterRepository,
                            MedicalOrderRepository orderRepository,
                            PrescriptionRepository prescriptionRepository) {
        this.patientRepository = patientRepository;
        this.encounterRepository = encounterRepository;
        this.orderRepository = orderRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    public DashboardStatsDto getStats() {
        long totalPatients = patientRepository.count();
        long openEncounters = encounterRepository.countByStatus("IN_PROGRESS");
        long pendingOrders = orderRepository.countByStatus("PENDING");
        long activePrescriptions = prescriptionRepository.countByStatus("ACTIVE");
        long abnormalResults = orderRepository.findAll().stream()
                .filter(o -> Boolean.TRUE.equals(o.getFlaggedAbnormal())).count();

        return new DashboardStatsDto(totalPatients, openEncounters, pendingOrders, activePrescriptions, abnormalResults);
    }
}
