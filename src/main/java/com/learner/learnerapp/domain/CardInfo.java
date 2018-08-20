package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A CardInfo.
 */
@Entity
@Table(name = "card_info")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class CardInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "repetitions")
    private Integer repetitions;

    @DecimalMin(value = "0")
    @DecimalMax(value = "1")
    @Column(name = "difficulty")
    private Double difficulty;

    @Column(name = "days_between_reviews")
    private Double daysBetweenReviews;

    @Column(name = "date_last_reviewed")
    private LocalDate dateLastReviewed;

    @OneToOne(mappedBy = "cardInfo")
    @JsonIgnore
    private Card card;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRepetitions() {
        return repetitions;
    }

    public CardInfo repetitions(Integer repetitions) {
        this.repetitions = repetitions;
        return this;
    }

    public void setRepetitions(Integer repetitions) {
        this.repetitions = repetitions;
    }

    public Double getDifficulty() {
        return difficulty;
    }

    public CardInfo difficulty(Double difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    public void setDifficulty(Double difficulty) {
        this.difficulty = difficulty;
    }

    public Double getDaysBetweenReviews() {
        return daysBetweenReviews;
    }

    public CardInfo daysBetweenReviews(Double daysBetweenReviews) {
        this.daysBetweenReviews = daysBetweenReviews;
        return this;
    }

    public void setDaysBetweenReviews(Double daysBetweenReviews) {
        this.daysBetweenReviews = daysBetweenReviews;
    }

    public LocalDate getDateLastReviewed() {
        return dateLastReviewed;
    }

    public CardInfo dateLastReviewed(LocalDate dateLastReviewed) {
        this.dateLastReviewed = dateLastReviewed;
        return this;
    }

    public void setDateLastReviewed(LocalDate dateLastReviewed) {
        this.dateLastReviewed = dateLastReviewed;
    }

    public Card getCard() {
        return card;
    }

    public CardInfo card(Card card) {
        this.card = card;
        return this;
    }

    public void setCard(Card card) {
        this.card = card;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CardInfo cardInfo = (CardInfo) o;
        if (cardInfo.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), cardInfo.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "CardInfo{" +
            "id=" + getId() +
            ", repetitions=" + getRepetitions() +
            ", difficulty=" + getDifficulty() +
            ", daysBetweenReviews=" + getDaysBetweenReviews() +
            ", dateLastReviewed='" + getDateLastReviewed() + "'" +
            "}";
    }
}
