package com.careconnect.ehr.repository;

import com.careconnect.ehr.entity.DrugInteractionRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrugInteractionRuleRepository extends JpaRepository<DrugInteractionRule, Long> {
    @Query("SELECT r FROM DrugInteractionRule r WHERE " +
           "(LOWER(r.drugA) = LOWER(:drug1) AND LOWER(r.drugB) = LOWER(:drug2)) OR " +
           "(LOWER(r.drugA) = LOWER(:drug2) AND LOWER(r.drugB) = LOWER(:drug1))")
    List<DrugInteractionRule> findInteraction(@Param("drug1") String drug1, @Param("drug2") String drug2);
}
