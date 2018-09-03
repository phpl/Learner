package com.learner.learnerapp.service.enums;

public enum Rating {
    ZERO(0), QUARTER(0.25), HALF(0.5), THREE_QUARTERS(0.75), FULL(1);

    private final double value;

    Rating(double value) {
        this.value = value;
    }

    public double getValue() {
        return value;
    }

    public static Rating getEnumByValue(Double value) {
        Rating rating = null;
        switch (value.intValue()) {
            case 1:
                rating = ZERO;
                break;
            case 2:
                rating = QUARTER;
                break;
            case 3:
                rating = HALF;
                break;
            case 4:
                rating = THREE_QUARTERS;
                break;
            case 5:
                rating = FULL;
                break;
        }
        return rating;
    }
}


