package com.finance.backend.controller;


import com.finance.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, Object>> getSummary(){
        return ResponseEntity.ok(dashboardService.getSummary());
    }
    @GetMapping("/income")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getTotalIncome(){
        return ResponseEntity.ok(dashboardService.getTotalIncome());
    }
    @GetMapping("/expenses")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getTotalExpenses(){
        return ResponseEntity.ok(dashboardService.getTotalExpenses());
    }
    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<BigDecimal> getNetBalance(){
        return ResponseEntity.ok(dashboardService.getNetBalance());
    }
    @GetMapping("/trends/monthly")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyTrends(){
        return ResponseEntity.ok(dashboardService.getMonthlyTrends());
    }
    @GetMapping("/trends/category")
    @PreAuthorize("hasAnyRole('ADMIN', 'ANALYST', 'VIEWER')")
    public ResponseEntity<Map<String, BigDecimal>> getCategoryTotals(){
        return ResponseEntity.ok(dashboardService.getCategoryWiseTotals());
    }
}
