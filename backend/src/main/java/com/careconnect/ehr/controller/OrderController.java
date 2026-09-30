package com.careconnect.ehr.controller;

import com.careconnect.ehr.dto.OrderDto;
import com.careconnect.ehr.security.CustomUserDetails;
import com.careconnect.ehr.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<OrderDto>> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(orderService.getOrdersByStatus(status));
        }
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<List<OrderDto>> getOrdersByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(orderService.getOrdersByPatient(patientId));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR')")
    public ResponseEntity<OrderDto> placeOrder(@Valid @RequestBody OrderDto dto,
                                              @AuthenticationPrincipal CustomUserDetails user,
                                              HttpServletRequest request) {
        return ResponseEntity.ok(orderService.placeOrder(dto, user.getId(), user.getFullName(), user.getRoleName(), request.getRemoteAddr()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DOCTOR', 'ROLE_NURSE')")
    public ResponseEntity<OrderDto> updateOrderStatus(@PathVariable Long id,
                                                      @RequestBody Map<String, Object> updatePayload,
                                                      @AuthenticationPrincipal CustomUserDetails user,
                                                      HttpServletRequest request) {
        String status = (String) updatePayload.get("status");
        String resultNotes = (String) updatePayload.get("resultNotes");
        String normalRange = (String) updatePayload.get("normalRange");
        Boolean flaggedAbnormal = (Boolean) updatePayload.get("flaggedAbnormal");

        return ResponseEntity.ok(orderService.updateOrderStatus(
                id, status, resultNotes, normalRange, flaggedAbnormal,
                user.getUsername(), user.getRoleName(), request.getRemoteAddr()
        ));
    }
}
