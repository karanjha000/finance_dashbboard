package com.finance.backend.service;

import com.finance.backend.dto.TransactionResponse;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.model.Transaction;
import com.finance.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;

    public BigDecimal getTotalIncome(){
        return transactionRepository.findByTypeAndDeletedFalse(TransactionType.INCOME)
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    public BigDecimal getTotalExpenses(){
        return transactionRepository.findByTypeAndDeletedFalse(TransactionType.EXPENSE)
                .stream()
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal getNetBalance(){
        return getTotalIncome().subtract(getTotalExpenses());
    }

    public Map<String, BigDecimal> getCategoryWiseTotals(){
        return transactionRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        Transaction::getCategory,
                        Collectors.reducing(BigDecimal.ZERO,
                                Transaction::getAmount,
                                BigDecimal::add)
                ));
    }

    public List<TransactionResponse> getRecentTransactions(){
        return transactionRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Transaction::getCreatedAt).reversed())
                .limit(5)
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Map<String, BigDecimal> getMonthlyTrends(){
        return transactionRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        t -> t.getDate().getMonth().name() + "-" + t.getDate().getYear(),
                        Collectors.reducing(BigDecimal.ZERO,
                                Transaction::getAmount,
                                BigDecimal::add)
                ));
    }

    public Map<String,Object> getSummary(){
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalIncome", getTotalIncome());
        summary.put("totalExpenses", getTotalExpenses());
        summary.put("netBalance", getNetBalance());
        summary.put("categoryWiseTotals", getCategoryWiseTotals());
        summary.put("monthlyTrends", getMonthlyTrends());
        summary.put("recentTransactions", getRecentTransactions());
        return summary;
    }

    private TransactionResponse mapToResponse(Transaction t) {
        TransactionResponse response = new TransactionResponse();
        response.setId(t.getId());
        response.setAmount(t.getAmount());
        response.setType(t.getType());
        response.setCategory(t.getCategory());
        response.setDate(t.getDate());
        response.setNotes(t.getNotes());
        response.setCreatedBy(t.getCreatedBy().getUsername());
        response.setCreatedAt(t.getCreatedAt());
        return response;
    }
}
