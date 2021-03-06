package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A UserExtra.
 */
@Entity
@Table(name = "user_extra")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class UserExtra implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private Long id;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "userExtra", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Card> cards = new HashSet<>();

    @OneToMany(mappedBy = "userExtra", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Category> categories = new HashSet<>();

    @OneToMany(mappedBy = "userExtra", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<UserProgress> userProgresses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public UserExtra user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Set<Card> getCards() {
        return cards;
    }

    public UserExtra cards(Set<Card> cards) {
        this.cards = cards;
        return this;
    }

    public UserExtra addCard(Card card) {
        this.cards.add(card);
        card.setUserExtra(this);
        return this;
    }

    public UserExtra removeCard(Card card) {
        this.cards.remove(card);
        card.setUserExtra(null);
        return this;
    }

    public void setCards(Set<Card> cards) {
        this.cards = cards;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public UserExtra categories(Set<Category> categories) {
        this.categories = categories;
        return this;
    }

    public UserExtra addCategory(Category category) {
        this.categories.add(category);
        category.setUserExtra(this);
        return this;
    }

    public UserExtra removeCategory(Category category) {
        this.categories.remove(category);
        category.setUserExtra(null);
        return this;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Set<UserProgress> getUserProgresses() {
        return userProgresses;
    }

    public UserExtra userProgresses(Set<UserProgress> userProgresses) {
        this.userProgresses = userProgresses;
        return this;
    }

    public UserExtra addUserProgress(UserProgress userProgress) {
        this.userProgresses.add(userProgress);
        userProgress.setUserExtra(this);
        return this;
    }

    public UserExtra removeUserProgress(UserProgress userProgress) {
        this.userProgresses.remove(userProgress);
        userProgress.setUserExtra(null);
        return this;
    }

    public void setUserProgresses(Set<UserProgress> userProgresses) {
        this.userProgresses = userProgresses;
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
        UserExtra userExtra = (UserExtra) o;
        if (userExtra.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), userExtra.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "UserExtra{" +
            "id=" + getId() +
            "}";
    }
}
