package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A UserProgress.
 */
@Entity
@Table(name = "user_progress")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserProgress implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "day")
    private LocalDate day;

    @Column(name = "daily_repetitions")
    private Integer dailyRepetitions;

    @ManyToOne
    @JsonIgnoreProperties("userProgresses")
    private UserExtra userExtra;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDay() {
        return day;
    }

    public UserProgress day(LocalDate day) {
        this.day = day;
        return this;
    }

    public void setDay(LocalDate day) {
        this.day = day;
    }

    public Integer getDailyRepetitions() {
        return dailyRepetitions;
    }

    public UserProgress dailyRepetitions(Integer dailyRepetitions) {
        this.dailyRepetitions = dailyRepetitions;
        return this;
    }

    public void setDailyRepetitions(Integer dailyRepetitions) {
        this.dailyRepetitions = dailyRepetitions;
    }

    public UserExtra getUserExtra() {
        return userExtra;
    }

    public UserProgress userExtra(UserExtra userExtra) {
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
        UserProgress userProgress = (UserProgress) o;
        if (userProgress.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userProgress.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserProgress{" +
            "id=" + getId() +
            ", day='" + getDay() + "'" +
            ", dailyRepetitions=" + getDailyRepetitions() +
            "}";
    }
}
