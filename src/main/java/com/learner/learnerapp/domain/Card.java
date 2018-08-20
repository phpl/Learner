package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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

    @OneToOne
    @JoinColumn(unique = true)
    private TextData textData;

    @OneToOne
    @JoinColumn(unique = true)
    private ImageData imageData;

    @OneToOne
    @JoinColumn(unique = true)
    private CardInfo cardInfo;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "card_tag",
               joinColumns = @JoinColumn(name = "cards_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "tags_id", referencedColumnName = "id"))
    private Set<Tag> tags = new HashSet<>();

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

    public TextData getTextData() {
        return textData;
    }

    public Card textData(TextData textData) {
        this.textData = textData;
        return this;
    }

    public void setTextData(TextData textData) {
        this.textData = textData;
    }

    public ImageData getImageData() {
        return imageData;
    }

    public Card imageData(ImageData imageData) {
        this.imageData = imageData;
        return this;
    }

    public void setImageData(ImageData imageData) {
        this.imageData = imageData;
    }

    public CardInfo getCardInfo() {
        return cardInfo;
    }

    public Card cardInfo(CardInfo cardInfo) {
        this.cardInfo = cardInfo;
        return this;
    }

    public void setCardInfo(CardInfo cardInfo) {
        this.cardInfo = cardInfo;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public Card tags(Set<Tag> tags) {
        this.tags = tags;
        return this;
    }

    public Card addTag(Tag tag) {
        this.tags.add(tag);
        tag.getCards().add(this);
        return this;
    }

    public Card removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getCards().remove(this);
        return this;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
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
            "}";
    }
}
