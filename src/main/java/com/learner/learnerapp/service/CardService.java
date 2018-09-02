package com.learner.learnerapp.service;

import com.learner.learnerapp.domain.Card;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Period;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CardService {

    private static final double DIFFICULTY_MAX = 2.0;
    private final Logger log = LoggerFactory.getLogger(CardService.class);

    public List<Card> getCardsForGame(List<Card> cards) {
        return cards
            .stream()
            .filter(this::isOlderThanEightHoursOrJustCreated)
            .sorted(Collections.reverseOrder(Comparator.comparingDouble(this::calculatePercentageOverdue)))
            .limit(10).collect(Collectors.toList());
    }

    private boolean isOlderThanEightHoursOrJustCreated(Card card) {
        if (isJustCreated(card.getDateLastReviewed())) {
            return true;
        } else {
            return Duration.between(card.getDateLastReviewed(), ZonedDateTime.now()).toHours() > 8;
        }
    }

    private Double calculatePercentageOverdue(Card card) {
        return calculatePercentageOverdue(card.getDateLastReviewed(), card.getDaysBetweenReviews());
    }

    private double calculatePercentageOverdue(ZonedDateTime dateLastReviewed, Double daysBetweenReviews) {
        if (isJustCreated(dateLastReviewed)) {
            return DIFFICULTY_MAX; // Just created cards weren't revised, so their difficulty should be max
        } else {
            double daysBetweenNowAndLastReview = Period.between(dateLastReviewed.toLocalDate(), ZonedDateTime.now().toLocalDate()).getDays();
            double tempPercentOverdue =  daysBetweenNowAndLastReview / daysBetweenReviews;
            return Math.min(DIFFICULTY_MAX, tempPercentOverdue);
        }
    }

    private boolean isJustCreated(ZonedDateTime dateLastReviewed) {
        return dateLastReviewed == null;
    }

}
