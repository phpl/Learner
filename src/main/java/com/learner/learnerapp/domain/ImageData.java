package com.learner.learnerapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A ImageData.
 */
@Entity
@Table(name = "image_data")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class ImageData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

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

    @OneToOne(mappedBy = "imageData")
    @JsonIgnore
    private Card card;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public byte[] getFrontImage() {
        return frontImage;
    }

    public ImageData frontImage(byte[] frontImage) {
        this.frontImage = frontImage;
        return this;
    }

    public void setFrontImage(byte[] frontImage) {
        this.frontImage = frontImage;
    }

    public String getFrontImageContentType() {
        return frontImageContentType;
    }

    public ImageData frontImageContentType(String frontImageContentType) {
        this.frontImageContentType = frontImageContentType;
        return this;
    }

    public void setFrontImageContentType(String frontImageContentType) {
        this.frontImageContentType = frontImageContentType;
    }

    public byte[] getBackImage() {
        return backImage;
    }

    public ImageData backImage(byte[] backImage) {
        this.backImage = backImage;
        return this;
    }

    public void setBackImage(byte[] backImage) {
        this.backImage = backImage;
    }

    public String getBackImageContentType() {
        return backImageContentType;
    }

    public ImageData backImageContentType(String backImageContentType) {
        this.backImageContentType = backImageContentType;
        return this;
    }

    public void setBackImageContentType(String backImageContentType) {
        this.backImageContentType = backImageContentType;
    }

    public Card getCard() {
        return card;
    }

    public ImageData card(Card card) {
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
        ImageData imageData = (ImageData) o;
        if (imageData.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), imageData.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ImageData{" +
            "id=" + getId() +
            ", frontImage='" + getFrontImage() + "'" +
            ", frontImageContentType='" + getFrontImageContentType() + "'" +
            ", backImage='" + getBackImage() + "'" +
            ", backImageContentType='" + getBackImageContentType() + "'" +
            "}";
    }
}
