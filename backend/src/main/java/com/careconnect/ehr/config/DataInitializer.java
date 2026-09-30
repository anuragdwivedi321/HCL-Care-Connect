package com.careconnect.ehr.config;

import com.careconnect.ehr.entity.*;
import com.careconnect.ehr.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final VitalSignRepository vitalSignRepository;
    private final ClinicalEncounterRepository encounterRepository;
    private final MedicalOrderRepository orderRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final DrugInteractionRuleRepository interactionRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           PatientRepository patientRepository,
                           VitalSignRepository vitalSignRepository,
                           ClinicalEncounterRepository encounterRepository,
                           MedicalOrderRepository orderRepository,
                           PrescriptionRepository prescriptionRepository,
                           DrugInteractionRuleRepository interactionRepository,
                           AuditLogRepository auditLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.vitalSignRepository = vitalSignRepository;
        this.encounterRepository = encounterRepository;
        this.orderRepository = orderRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.interactionRepository = interactionRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Seed Drug-Drug Interaction Rules
        interactionRepository.saveAll(List.of(
            new DrugInteractionRule("Warfarin", "Aspirin", "HIGH",
                "Concurrent use significantly increases risk of major gastrointestinal and systemic bleeding.",
                "Avoid combination unless specifically indicated (e.g. mechanical heart valve); close INR monitoring mandatory."),
            new DrugInteractionRule("Lisinopril", "Spironolactone", "HIGH",
                "Concurrent ACE inhibitor and potassium-sparing diuretic can cause severe, life-threatening hyperkalemia.",
                "Monitor serum potassium and renal function within 1 week of co-administration."),
            new DrugInteractionRule("Metformin", "Iodinated Contrast", "HIGH",
                "Risk of lactic acidosis in patients undergoing radiographic procedures with iodinated contrast media.",
                "Discontinue metformin prior to or at the time of procedure; withhold for 48 hours post-procedure until renal function confirmed normal."),
            new DrugInteractionRule("Clopidogrel", "Omeprazole", "MODERATE",
                "Omeprazole inhibits CYP2C19, significantly reducing the antiplatelet efficacy of clopidogrel.",
                "Consider alternative acid suppressant such as Pantoprazole or H2-receptor antagonist (Famotidine)."),
            new DrugInteractionRule("Simvastatin", "Amiodarone", "MODERATE",
                "Amiodarone inhibits CYP3A4 metabolism of simvastatin, increasing the risk of rhabdomyolysis.",
                "Do not exceed simvastatin 20 mg daily when co-administered with amiodarone, or switch to Rosuvastatin.")
        ));

        // 2. Seed Patients
        Patient p1 = new Patient();
        p1.setMrn("MRN-2026-1001");
        p1.setFirstName("Rohit");
        p1.setLastName("Verma");
        p1.setDateOfBirth(LocalDate.of(1982, 5, 14));
        p1.setGender("Male");
        p1.setBloodGroup("O+");
        p1.setPhone("+91 98765 43210");
        p1.setEmail("rohit.verma@example.com");
        p1.setAddress("42 Palm Meadows, Whitefield");
        p1.setCity("Bengaluru");
        p1.setState("Karnataka");
        p1.setPostalCode("560066");
        p1.setEmergencyContactName("Sunita Verma");
        p1.setEmergencyContactPhone("+91 98765 43211");
        p1.setEmergencyContactRelationship("Spouse");
        p1.setAllergies("Penicillin (Hives/Anaphylaxis), Sulfa drugs");
        p1.setChronicConditions("Essential Hypertension (I10), Dyslipidemia (E78.5)");
        p1.setInsuranceProvider("Star Health & Allied Insurance");
        p1.setPolicyNumber("SH-IND-2026-88741");
        p1 = patientRepository.save(p1);

        Patient p2 = new Patient();
        p2.setMrn("MRN-2026-1002");
        p2.setFirstName("Ananya");
        p2.setLastName("Deshmukh");
        p2.setDateOfBirth(LocalDate.of(1991, 11, 23));
        p2.setGender("Female");
        p2.setBloodGroup("B+");
        p2.setPhone("+91 98123 45678");
        p2.setEmail("ananya.d@example.com");
        p2.setAddress("702 Sky Tower, Kothrud");
        p2.setCity("Pune");
        p2.setState("Maharashtra");
        p2.setPostalCode("411038");
        p2.setEmergencyContactName("Vikram Deshmukh");
        p2.setEmergencyContactPhone("+91 98123 45679");
        p2.setEmergencyContactRelationship("Brother");
        p2.setAllergies("NSAIDs (Aspirin sensitivity)");
        p2.setChronicConditions("Type 2 Diabetes Mellitus (E11.9)");
        p2.setInsuranceProvider("HDFC ERGO Health");
        p2.setPolicyNumber("HE-CORP-99231");
        p2 = patientRepository.save(p2);

        Patient p3 = new Patient();
        p3.setMrn("MRN-2026-1003");
        p3.setFirstName("Suresh");
        p3.setLastName("Menon");
        p3.setDateOfBirth(LocalDate.of(1968, 3, 30));
        p3.setGender("Male");
        p3.setBloodGroup("A+");
        p3.setPhone("+91 97451 22334");
        p3.setEmail("suresh.menon@example.com");
        p3.setAddress("18 MG Road, Marine Drive");
        p3.setCity("Kochi");
        p3.setState("Kerala");
        p3.setPostalCode("682011");
        p3.setEmergencyContactName("Radha Menon");
        p3.setEmergencyContactPhone("+91 97451 22335");
        p3.setEmergencyContactRelationship("Spouse");
        p3.setAllergies("No known drug allergies (NKDA)");
        p3.setChronicConditions("Coronary Artery Disease (I25.10), Atrial Fibrillation (I48.91)");
        p3.setInsuranceProvider("Care Health Insurance");
        p3.setPolicyNumber("CHI-SENIOR-4412");
        p3 = patientRepository.save(p3);

        // 3. Seed Users (Doctors, Nurses, Admin, Patients)
        User admin = new User("admin", passwordEncoder.encode("Admin@123"), "System Administrator", "admin@careconnect.io", Role.ROLE_ADMIN);
        User drSharma = new User("dr.sharma", passwordEncoder.encode("Doctor@123"), "Dr. Rajesh Sharma, MD", "rsharma@careconnect.io", Role.ROLE_DOCTOR);
        drSharma.setSpecialization("Cardiology");
        drSharma.setLicenseNumber("MCI-CARD-44109");

        User drPatel = new User("dr.patel", passwordEncoder.encode("Doctor@123"), "Dr. Sneha Patel, MD", "spatel@careconnect.io", Role.ROLE_DOCTOR);
        drPatel.setSpecialization("Internal Medicine");
        drPatel.setLicenseNumber("MCI-INT-55291");

        User nursePriya = new User("nurse.priya", passwordEncoder.encode("Nurse@123"), "Nurse Priya Nair, BSN", "pnair@careconnect.io", Role.ROLE_NURSE);
        nursePriya.setLicenseNumber("INC-RN-88123");

        User patientUser1 = new User("patient.rohit", passwordEncoder.encode("Patient@123"), "Rohit Verma", "rohit.verma@example.com", Role.ROLE_PATIENT);
        patientUser1.setPatientId(p1.getId());

        User patientUser2 = new User("patient.ananya", passwordEncoder.encode("Patient@123"), "Ananya Deshmukh", "ananya.d@example.com", Role.ROLE_PATIENT);
        patientUser2.setPatientId(p2.getId());

        User priyankUser = new User("priyank", passwordEncoder.encode("Password@123"), "Priyank", "priyank132021@gmail.com", Role.ROLE_DOCTOR);
        priyankUser.setSpecialization("General Physician");
        priyankUser.setLicenseNumber("DOC-PRIYANK-2026");

        userRepository.saveAll(List.of(admin, drSharma, drPatel, nursePriya, patientUser1, patientUser2, priyankUser));

        // 4. Seed Vitals for Patients
        VitalSign v1 = new VitalSign();
        v1.setPatientId(p1.getId());
        v1.setRecordedAt(LocalDateTime.now().minusDays(5));
        v1.setSystolicBP(138);
        v1.setDiastolicBP(88);
        v1.setHeartRate(78);
        v1.setRespiratoryRate(16);
        v1.setTemperature(36.8);
        v1.setOxygenSaturation(98);
        v1.setHeightCm(175.0);
        v1.setWeightKg(82.0);
        v1.setBmi(26.8);
        v1.setRecordedBy("Nurse Priya Nair, BSN");
        v1.setNotes("Routine pre-consultation vitals. Blood pressure slightly elevated.");

        VitalSign v2 = new VitalSign();
        v2.setPatientId(p1.getId());
        v2.setRecordedAt(LocalDateTime.now().minusHours(2));
        v2.setSystolicBP(128);
        v2.setDiastolicBP(82);
        v2.setHeartRate(72);
        v2.setRespiratoryRate(15);
        v2.setTemperature(36.6);
        v2.setOxygenSaturation(99);
        v2.setHeightCm(175.0);
        v2.setWeightKg(81.5);
        v2.setBmi(26.6);
        v2.setRecordedBy("Nurse Priya Nair, BSN");
        v2.setNotes("Follow-up vitals. BP improved following antihypertensive titration.");

        vitalSignRepository.saveAll(List.of(v1, v2));

        // 5. Seed Clinical SOAP Encounters
        ClinicalEncounter enc1 = new ClinicalEncounter();
        enc1.setPatientId(p1.getId());
        enc1.setProviderId(drSharma.getId());
        enc1.setProviderName(drSharma.getFullName());
        enc1.setEncounterDate(LocalDateTime.now().minusDays(5));
        enc1.setEncounterType("OUTPATIENT");
        enc1.setChiefComplaint("Routine cardiovascular checkup and mild morning headaches");
        enc1.setSoapSubjective("Patient reports mild bilateral morning headaches over past 2 weeks. Denies chest pain, palpitations, orthopnea, or pedal edema. Good medication compliance reported.");
        enc1.setSoapObjective("BP: 138/88 mmHg, HR: 78 bpm regular. S1/S2 heard normally, no murmurs. Lungs clear to auscultation bilaterally. No peripheral edema.");
        enc1.setSoapAssessment("1. Essential hypertension (ICD-10 I10) - suboptimally controlled.\n2. Dyslipidemia (ICD-10 E78.5) - on statin therapy.");
        enc1.setSoapPlan("1. Increase Lisinopril from 10mg to 20mg once daily.\n2. Order fasting lipid profile and basic metabolic panel.\n3. Instruct home blood pressure log (morning & evening).\n4. Follow-up in 4 weeks.");
        enc1.setIcd10Codes("I10, E78.5");
        enc1.setStatus("SIGNED");
        enc1.setSignedAt(LocalDateTime.now().minusDays(5));
        enc1.setSignedBy(drSharma.getFullName());
        enc1 = encounterRepository.save(enc1);

        // 6. Seed CPOE Orders
        MedicalOrder o1 = new MedicalOrder();
        o1.setPatientId(p1.getId());
        o1.setProviderId(drSharma.getId());
        o1.setEncounterId(enc1.getId());
        o1.setOrderType("LAB");
        o1.setOrderName("Lipid Profile Panel");
        o1.setLoincCode("57698-3");
        o1.setPriority("ROUTINE");
        o1.setClinicalIndication("Monitoring hyperlipidemia on statin therapy");
        o1.setStatus("COMPLETED");
        o1.setOrderedAt(LocalDateTime.now().minusDays(5));
        o1.setCompletedAt(LocalDateTime.now().minusDays(3));
        o1.setNormalRange("Cholesterol < 200 mg/dL, LDL < 100 mg/dL, HDL > 40 mg/dL, Triglycerides < 150 mg/dL");
        o1.setResultNotes("Total Cholesterol: 215 mg/dL (Elevated), LDL: 132 mg/dL (Borderline High), HDL: 44 mg/dL (Normal), Triglycerides: 195 mg/dL (Borderline High).");
        o1.setFlaggedAbnormal(true);

        MedicalOrder o2 = new MedicalOrder();
        o2.setPatientId(p1.getId());
        o2.setProviderId(drSharma.getId());
        o2.setEncounterId(enc1.getId());
        o2.setOrderType("LAB");
        o2.setOrderName("Basic Metabolic Panel (BMP)");
        o2.setLoincCode("24320-4");
        o2.setPriority("ROUTINE");
        o2.setClinicalIndication("Electrolyte and renal baseline before ACE inhibitor titration");
        o2.setStatus("COMPLETED");
        o2.setOrderedAt(LocalDateTime.now().minusDays(5));
        o2.setCompletedAt(LocalDateTime.now().minusDays(3));
        o2.setNormalRange("Na: 135-145, K: 3.5-5.0 mEq/L, Creatinine: 0.7-1.3 mg/dL, eGFR > 60");
        o2.setResultNotes("Sodium: 140 mEq/L (Normal), Potassium: 4.4 mEq/L (Normal), BUN: 16 mg/dL, Serum Creatinine: 0.9 mg/dL (Normal), eGFR: 92 mL/min.");
        o2.setFlaggedAbnormal(false);

        MedicalOrder o3 = new MedicalOrder();
        o3.setPatientId(p1.getId());
        o3.setProviderId(drSharma.getId());
        o3.setEncounterId(enc1.getId());
        o3.setOrderType("RADIOLOGY");
        o3.setOrderName("Chest X-Ray PA View");
        o3.setLoincCode("36554-4");
        o3.setPriority("ROUTINE");
        o3.setClinicalIndication("Cardiothoracic ratio assessment");
        o3.setStatus("PENDING");
        o3.setOrderedAt(LocalDateTime.now().minusDays(1));
        o3.setFlaggedAbnormal(false);

        orderRepository.saveAll(List.of(o1, o2, o3));

        // 7. Seed Prescriptions
        Prescription rx1 = new Prescription();
        rx1.setPatientId(p1.getId());
        rx1.setProviderId(drSharma.getId());
        rx1.setEncounterId(enc1.getId());
        rx1.setMedicationName("Lisinopril");
        rx1.setRxNormCode("314076");
        rx1.setDosage("20 mg");
        rx1.setFrequency("Once daily");
        rx1.setRoute("Oral");
        rx1.setDurationDays(30);
        rx1.setInstructions("Take 1 tablet every morning with or without food. Avoid potassium supplements.");
        rx1.setRefills(3);
        rx1.setStatus("ACTIVE");
        rx1.setPrescribedAt(LocalDateTime.now().minusDays(5));

        Prescription rx2 = new Prescription();
        rx2.setPatientId(p1.getId());
        rx2.setProviderId(drSharma.getId());
        rx2.setEncounterId(enc1.getId());
        rx2.setMedicationName("Atorvastatin");
        rx2.setRxNormCode("259255");
        rx2.setDosage("20 mg");
        rx2.setFrequency("Once daily at bedtime");
        rx2.setRoute("Oral");
        rx2.setDurationDays(90);
        rx2.setInstructions("Take 1 tablet at bedtime. Report any unexplained muscle soreness.");
        rx2.setRefills(2);
        rx2.setStatus("ACTIVE");
        rx2.setPrescribedAt(LocalDateTime.now().minusDays(30));

        prescriptionRepository.saveAll(List.of(rx1, rx2));

        // 8. Seed Audit Trail
        auditLogRepository.saveAll(List.of(
            new AuditLog("dr.sharma", "ROLE_DOCTOR", "LOGIN", "User", drSharma.getId(), "Clinician authenticated successfully", "127.0.0.1"),
            new AuditLog("dr.sharma", "ROLE_DOCTOR", "VIEW_PATIENT", "Patient", p1.getId(), "Accessed medical chart of Rohit Verma (MRN-2026-1001)", "127.0.0.1"),
            new AuditLog("dr.sharma", "ROLE_DOCTOR", "SIGN_SOAP_NOTE", "ClinicalEncounter", enc1.getId(), "Digitally signed outpatient SOAP encounter note", "127.0.0.1"),
            new AuditLog("dr.sharma", "ROLE_DOCTOR", "PLACE_CPOE_ORDER", "MedicalOrder", o1.getId(), "Placed CPOE Lipid Profile lab requisition", "127.0.0.1"),
            new AuditLog("dr.sharma", "ROLE_DOCTOR", "PRESCRIBE_MEDICATION", "Prescription", rx1.getId(), "E-Prescribed Lisinopril 20mg PO QD", "127.0.0.1")
        ));
    }
}
