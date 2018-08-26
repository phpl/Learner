package com.learner.learnerapp.service;

import com.learner.learnerapp.domain.User;
import com.learner.learnerapp.domain.UserExtra;
import com.learner.learnerapp.repository.CardRepository;
import com.learner.learnerapp.repository.UserExtraRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Properties;

@Service
@Transactional
public class UserExtraService {

    private final Logger log = LoggerFactory.getLogger(UserExtraService.class);

    @Autowired
    private UserExtraRepository userExtraRepository;

    @Autowired
    private CardRepository cardRepository;

    public void registerUserExtra(User newUser) {
        UserExtra newUserExtra = new UserExtra();
        newUserExtra.setUser(newUser);
        newUserExtra.setId(newUser.getId());
        userExtraRepository.save(newUserExtra);
        log.debug("Created Information for UserExtra: {}", newUserExtra);
    }


    public void deleteUserExtra(long userId) {
        userExtraRepository.findById(userId).ifPresent(userExtra -> {
            long deletedCount = cardRepository.deleteAllByUserExtraId(userId);
            log.debug("Deleted All cards by UserExtraId, number of deleted: {}", deletedCount);

            userExtraRepository.delete(userExtra);
            log.debug("Deleted UserExtra: {}", userExtra);
        });
    }
}
