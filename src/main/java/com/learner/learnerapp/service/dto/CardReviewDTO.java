package com.learner.learnerapp.service.dto;

import java.time.ZonedDateTime;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;

/**
 * A DTO for the CardReview entity.
 */
public class CardReviewDTO implements Serializable {

    private Long id;

    private Integer rating;

    public CardReviewDTO(Long id, Integer rating) {
        this.id = id;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CardReviewDTO)) return false;
        CardReviewDTO that = (CardReviewDTO) o;
        return Objects.equals(getId(), that.getId()) &&
            Objects.equals(getRating(), that.getRating());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getRating());
    }

    @Override
    public String toString() {
        return "CardReviewDTO{" +
            "id=" + id +
            ", rating=" + rating +
            '}';
    }
}
