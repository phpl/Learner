package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A Card.
 */
@Entity
@Table(name = "card")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Card implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "front_text")
    private String frontText;

    @Column(name = "back_text")
    private String backText;

    @Lob
    @Column(name = "front_image")
    private byte[] frontImage;

    @Column(name = "front_image_content_type")
    private String frontImageContentType;

    @Lob
    @Column(name = "back_image")
    private byte[] backImage;

    @Column(name = "back_image_content_type")
    private String backImageContentType;

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

    @ManyToOne
    @JsonIgnoreProperties("cards")
    private Category category;

    @ManyToOne
    @JsonIgnoreProperties("cards")
    private UserExtra userExtra;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFrontText() {
        return frontText;
    }

    public Card frontText(String frontText) {
        this.frontText = frontText;
        return this;
    }

    public void setFrontText(String frontText) {
        this.frontText = frontText;
    }

    public String getBackText() {
        return backText;
    }

    public Card backText(String backText) {
        this.backText = backText;
        return this;
    }

    public void setBackText(String backText) {
        this.backText = backText;
    }

    public byte[] getFrontImage() {
        return frontImage;
    }

    public Card frontImage(byte[] frontImage) {
        this.frontImage = frontImage;
        return this;
    }

    public void setFrontImage(byte[] frontImage) {
        this.frontImage = frontImage;
    }

    public String getFrontImageContentType() {
        return frontImageContentType;
    }

    public Card frontImageContentType(String frontImageContentType) {
        this.frontImageContentType = frontImageContentType;
        return this;
    }

    public void setFrontImageContentType(String frontImageContentType) {
        this.frontImageContentType = frontImageContentType;
    }

    public byte[] getBackImage() {
        return backImage;
    }

    public Card backImage(byte[] backImage) {
        this.backImage = backImage;
        return this;
    }

    public void setBackImage(byte[] backImage) {
        this.backImage = backImage;
    }

    public String getBackImageContentType() {
        return backImageContentType;
    }

    public Card backImageContentType(String backImageContentType) {
        this.backImageContentType = backImageContentType;
        return this;
    }

    public void setBackImageContentType(String backImageContentType) {
        this.backImageContentType = backImageContentType;
    }

    public Integer getRepetitions() {
        return repetitions;
    }

    public Card repetitions(Integer repetitions) {
        this.repetitions = repetitions;
        return this;
    }

    public void setRepetitions(Integer repetitions) {
        this.repetitions = repetitions;
    }

    public Double getDifficulty() {
        return difficulty;
    }

    public Card difficulty(Double difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    public void setDifficulty(Double difficulty) {
        this.difficulty = difficulty;
    }

    public Double getDaysBetweenReviews() {
        return daysBetweenReviews;
    }

    public Card daysBetweenReviews(Double daysBetweenReviews) {
        this.daysBetweenReviews = daysBetweenReviews;
        return this;
    }

    public void setDaysBetweenReviews(Double daysBetweenReviews) {
        this.daysBetweenReviews = daysBetweenReviews;
    }

    public LocalDate getDateLastReviewed() {
        return dateLastReviewed;
    }

    public Card dateLastReviewed(LocalDate dateLastReviewed) {
        this.dateLastReviewed = dateLastReviewed;
        return this;
    }

    public void setDateLastReviewed(LocalDate dateLastReviewed) {
        this.dateLastReviewed = dateLastReviewed;
    }

    public Category getCategory() {
        return category;
    }

    public Card category(Category category) {
        this.category = category;
        return this;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public UserExtra getUserExtra() {
        return userExtra;
    }

    public Card userExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
        return this;
    }

    public void setUserExtra(UserExtra userExtra) {
        this.userExtra = userExtra;
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
        Card card = (Card) o;
        if (card.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), card.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Card{" +
            "id=" + getId() +
            ", frontText='" + getFrontText() + "'" +
            ", backText='" + getBackText() + "'" +
            ", frontImage='" + getFrontImage() + "'" +
            ", frontImageContentType='" + getFrontImageContentType() + "'" +
            ", backImage='" + getBackImage() + "'" +
            ", backImageContentType='" + getBackImageContentType() + "'" +
            ", repetitions=" + getRepetitions() +
            ", difficulty=" + getDifficulty() +
            ", daysBetweenReviews=" + getDaysBetweenReviews() +
            ", dateLastReviewed='" + getDateLastReviewed() + "'" +
            "}";
    }
}
