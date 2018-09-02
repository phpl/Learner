package com.learner.learnerapp.service;

import com.learner.learnerapp.LearnerappApp;
import com.learner.learnerapp.domain.Card;
import com.learner.learnerapp.repository.CardRepository;
import com.learner.learnerapp.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;


@RunWith(SpringRunner.class)
@SpringBootTest(classes = LearnerappApp.class)
public class CardServiceIntTest {

    @Autowired
    private CardService cardService;

    private List<Card> cards = new ArrayList<>();

    @Before
    public void setUp() throws Exception {
        for (int i = 0; i < 11; i++) {
            Card card = new Card();
            ZonedDateTime nowMinus9Hours = ZonedDateTime.now().minusHours(9);
            card.setDateLastReviewed(nowMinus9Hours );
            card.setDaysBetweenReviews(2.0);
            cards.add(card);
        }

        cards.get(0).setDateLastReviewed(ZonedDateTime.now());
        cards.get(1).setDateLastReviewed(null);
        cards.get(1).setDaysBetweenReviews(null);
    }

    @Test
    @Transactional
    public void getCardsForGame() {
        List<Card> cardsForGame = cardService.getCardsForGame(cards);

        assertEquals(10, cardsForGame.size());
    }
}
