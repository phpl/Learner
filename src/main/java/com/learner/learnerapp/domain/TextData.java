package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A TextData.
 */
@Entity
@Table(name = "text_data")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class TextData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "front_text")
    private String frontText;

    @Column(name = "back_text")
    private String backText;

    @OneToOne(mappedBy = "textData")
    @JsonIgnore
    private Card card;

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

    public TextData frontText(String frontText) {
        this.frontText = frontText;
        return this;
    }

    public void setFrontText(String frontText) {
        this.frontText = frontText;
    }

    public String getBackText() {
        return backText;
    }

    public TextData backText(String backText) {
        this.backText = backText;
        return this;
    }

    public void setBackText(String backText) {
        this.backText = backText;
    }

    public Card getCard() {
        return card;
    }

    public TextData card(Card card) {
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
        TextData textData = (TextData) o;
        if (textData.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), textData.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "TextData{" +
            "id=" + getId() +
            ", frontText='" + getFrontText() + "'" +
            ", backText='" + getBackText() + "'" +
            "}";
    }
}
