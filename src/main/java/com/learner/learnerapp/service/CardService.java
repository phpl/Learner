package com.learner.learnerapp.service;

import com.learner.learnerapp.domain.Card;
import com.learner.learnerapp.repository.CardRepository;
import com.learner.learnerapp.service.enums.Rating;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Period;
import java.time.ZoneId;
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

    private final CardRepository cardRepository;

    @Autowired
    public CardService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    public List<Card> getCardsForGame(List<Card> cards) {
        return cards
            .stream()
            .filter(this::isOlderThanFourHoursOrJustCreated)
            .sorted(Collections.reverseOrder(Comparator.comparingDouble(this::calculatePercentageOverdueBeforeRevise)))
            .limit(10).collect(Collectors.toList());
    }

    private boolean isOlderThanFourHoursOrJustCreated(Card card) {
        if (isJustCreated(card)) {
            return true;
        } else {
            return Duration.between(card.getDateLastReviewed(), ZonedDateTime.now()).toHours() > 4;
        }
    }

    private Double calculatePercentageOverdueBeforeRevise(Card card) {
        if (isJustCreated(card)) {
            return DIFFICULTY_MAX; // Just created cards weren't revised, so their difficulty should be max
        } else {
            return calculatePercentageOverdue(card.getDateLastReviewed(), card.getDaysBetweenReviews());
        }
    }

    private double calculatePercentageOverdue(ZonedDateTime dateLastReviewed, Double daysBetweenReviews) {
        double daysBetweenNowAndLastReview = Period.between(dateLastReviewed.toLocalDate(), ZonedDateTime.now().toLocalDate()).getDays();
        double tempPercentOverdue = daysBetweenNowAndLastReview / daysBetweenReviews;
        return Math.min(DIFFICULTY_MAX, tempPercentOverdue);
    }

    private boolean isJustCreated(Card card) {
        return card.getDateLastReviewed() == null;
    }

    public Card updateCardAfterReview(Card cardToUpdate, double rating) {
        Rating cardRating = Rating.getEnumByValue(rating);

        double difficulty = calculateDifficulty(cardToUpdate, cardRating);
        cardToUpdate.setDifficulty(difficulty);

        double difficultyWeight = calculateDifficultyWeight(difficulty);
        double percentOverdue = calculatePercentageOverdueAfterRevise(cardToUpdate, cardRating);
        double daysBetweenReviews = calculateDaysBetweenReviews(difficultyWeight, percentOverdue, cardRating, cardToUpdate);
        cardToUpdate.setDaysBetweenReviews(daysBetweenReviews);

        ZonedDateTime currentZonedDateTime = ZonedDateTime.now(ZoneId.systemDefault());
        cardToUpdate.setDateLastReviewed(currentZonedDateTime);

        cardToUpdate.setRepetitions(cardToUpdate.getRepetitions() + 1);

        return cardRepository.save(cardToUpdate);
    }

    private double calculateDifficulty(Card card, Rating rating) {
        Double calculatedPercentageOverdue = calculatePercentageOverdueAfterRevise(card, rating);

        double calculatedDifficulty = card.getDifficulty() + calculatedPercentageOverdue * (8 - 9 * rating.getValue()) / 17;

        return calculatedDifficulty > 1 ? 1 : calculatedDifficulty < 0 ? 0 : calculatedDifficulty;
    }

    private double calculateDifficultyWeight(double difficulty) {
        return 3 - 1.7 * difficulty;
    }

    private double calculateDaysBetweenReviews(double difficultyWeight, double percentOverdue, Rating cardRating, Card card) {
        if (isCorrect(cardRating)) {
            return card.getDaysBetweenReviews() * (1 + (difficultyWeight - 1) * percentOverdue);
        } else {
            double temp = card.getDaysBetweenReviews() * (1 / Math.pow(difficultyWeight, 2));
            return temp >= 1.0 ? temp : 1.0;
        }
    }

    private Double calculatePercentageOverdueAfterRevise(Card card, Rating cardRating) {
        if (isCorrect(cardRating)) {
            return calculatePercentageOverdue(card.getDateLastReviewed(), card.getDaysBetweenReviews());
        } else {
            return 1.0;
        }
    }

    private boolean isCorrect(Rating cardRating) {
        return Double.compare(cardRating.getValue(), Rating.HALF.getValue()) >= 0;
    }


}
