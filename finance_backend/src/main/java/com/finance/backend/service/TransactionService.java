package com.finance.backend.service;

import com.finance.backend.dto.TransactionRequest;
import com.finance.backend.dto.TransactionResponse;
import com.finance.backend.enums.TransactionType;
import com.finance.backend.model.Transaction;
import com.finance.backend.model.User;
import com.finance.backend.repository.TransactionRepository;
import com.finance.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionResponse create(TransactionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Transaction transaction = new Transaction();
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());
        transaction.setCreatedBy(user);

        return mapToResponse(transactionRepository.save(transaction));
    }

    public List<TransactionResponse> getAll() {
        return transactionRepository.findAllByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TransactionResponse getById(Long id) {
        Transaction transaction = transactionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    public Page<TransactionResponse> getAllPaged(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return transactionRepository.findAllByDeletedFalse(pageable)
                .map(this::mapToResponse);
    }

    public TransactionResponse update(Long id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));

        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(request.getCategory());
        transaction.setDate(request.getDate());
        transaction.setNotes(request.getNotes());

        return mapToResponse(transactionRepository.save(transaction));
    }

    public void delete(Long id) {
        Transaction transaction = transactionRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
        transaction.setDeleted(true);
        transactionRepository.save(transaction);
    }

    public List<TransactionResponse> filterByType(TransactionType type) {
        return transactionRepository.findByTypeAndDeletedFalse(type)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> filterByCategory(String category) {
        return transactionRepository.findByCategoryAndDeletedFalse(category)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<TransactionResponse> filterByDateRange(LocalDate start, LocalDate end) {
        return transactionRepository.findByDateBetweenAndDeletedFalse(start, end)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TransactionResponse mapToResponse(Transaction t) {
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