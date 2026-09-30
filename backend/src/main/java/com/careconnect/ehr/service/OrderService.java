package com.careconnect.ehr.service;

import com.careconnect.ehr.dto.OrderDto;
import com.careconnect.ehr.entity.MedicalOrder;
import com.careconnect.ehr.repository.MedicalOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final MedicalOrderRepository orderRepository;
    private final AuditService auditService;

    public OrderService(MedicalOrderRepository orderRepository, AuditService auditService) {
        this.orderRepository = orderRepository;
        this.auditService = auditService;
    }

    public List<OrderDto> getOrdersByPatient(Long patientId) {
        return orderRepository.findByPatientIdOrderByOrderedAtDesc(patientId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<OrderDto> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll()
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public OrderDto placeOrder(OrderDto dto, Long providerId, String providerName, String userRole, String ipAddress) {
        MedicalOrder order = new MedicalOrder();
        order.setPatientId(dto.getPatientId());
        order.setProviderId(providerId != null ? providerId : 1L);
        order.setEncounterId(dto.getEncounterId());
        order.setOrderType(dto.getOrderType());
        order.setOrderName(dto.getOrderName());
        order.setLoincCode(dto.getLoincCode());
        order.setPriority(dto.getPriority());
        order.setClinicalIndication(dto.getClinicalIndication());
        order.setStatus("PENDING");
        order.setOrderedAt(LocalDateTime.now());
        order.setFlaggedAbnormal(false);

        MedicalOrder saved = orderRepository.save(order);

        auditService.log(providerName, userRole, "PLACE_CPOE_ORDER", "MedicalOrder", saved.getId(),
                "Placed " + saved.getOrderType() + " order: " + saved.getOrderName() + " (Priority: " + saved.getPriority() + ")", ipAddress);

        return mapToDto(saved);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status, String resultNotes, String normalRange, Boolean flaggedAbnormal, String performedBy, String userRole, String ipAddress) {
        MedicalOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        order.setStatus(status);
        if (resultNotes != null) order.setResultNotes(resultNotes);
        if (normalRange != null) order.setNormalRange(normalRange);
        if (flaggedAbnormal != null) order.setFlaggedAbnormal(flaggedAbnormal);

        if ("COMPLETED".equalsIgnoreCase(status) || "RESULTED".equalsIgnoreCase(status)) {
            order.setCompletedAt(LocalDateTime.now());
        }

        MedicalOrder saved = orderRepository.save(order);

        auditService.log(performedBy, userRole, "UPDATE_ORDER_STATUS", "MedicalOrder", orderId,
                "Updated CPOE order status to " + status + (flaggedAbnormal != null && flaggedAbnormal ? " [ABNORMAL RESULT FLAGGED]" : ""), ipAddress);

        return mapToDto(saved);
    }

    private OrderDto mapToDto(MedicalOrder o) {
        OrderDto dto = new OrderDto();
        dto.setId(o.getId());
        dto.setPatientId(o.getPatientId());
        dto.setProviderId(o.getProviderId());
        dto.setEncounterId(o.getEncounterId());
        dto.setOrderType(o.getOrderType());
        dto.setOrderName(o.getOrderName());
        dto.setLoincCode(o.getLoincCode());
        dto.setPriority(o.getPriority());
        dto.setClinicalIndication(o.getClinicalIndication());
        dto.setStatus(o.getStatus());
        dto.setOrderedAt(o.getOrderedAt());
        dto.setCompletedAt(o.getCompletedAt());
        dto.setResultNotes(o.getResultNotes());
        dto.setNormalRange(o.getNormalRange());
        dto.setFlaggedAbnormal(o.getFlaggedAbnormal());
        return dto;
    }
}
