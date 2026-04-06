package com.finance.backend.repository;

import com.finance.backend.model.Transaction;
import com.finance.backend.enums.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByTypeAndDeletedFalse(TransactionType type);
    List<Transaction> findByCategoryAndDeletedFalse(String category);
    List<Transaction> findByDateBetweenAndDeletedFalse(LocalDate start, LocalDate end);
    List<Transaction> findByCreatedByIdAndDeletedFalse(Long userId);
    List<Transaction> findAllByDeletedFalse();
    Optional<Transaction> findByIdAndDeletedFalse(Long id);
    Page<Transaction> findAllByDeletedFalse(Pageable pageable);
}