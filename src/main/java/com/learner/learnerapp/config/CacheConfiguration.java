package com.learner.learnerapp.config;

import java.time.Duration;

import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;

import io.github.jhipster.config.jcache.BeanClassLoaderAwareJCacheRegionFactory;
import io.github.jhipster.config.JHipsterProperties;

import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.*;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        BeanClassLoaderAwareJCacheRegionFactory.setBeanClassLoader(this.getClass().getClassLoader());
        JHipsterProperties.Cache.Ehcache ehcache =
            jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration = Eh107Configuration.fromEhcacheCacheConfiguration(
            CacheConfigurationBuilder.newCacheConfigurationBuilder(Object.class, Object.class,
                ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                .build());
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            cm.createCache(com.learner.learnerapp.repository.UserRepository.USERS_BY_LOGIN_CACHE, jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.repository.UserRepository.USERS_BY_EMAIL_CACHE, jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.User.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.Authority.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.User.class.getName() + ".authorities", jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.PersistentToken.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.User.class.getName() + ".persistentTokens", jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.Tag.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.Tag.class.getName() + ".cards", jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.Card.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.Card.class.getName() + ".tags", jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.TextData.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.ImageData.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.CardInfo.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.UserExtra.class.getName(), jcacheConfiguration);
            cm.createCache(com.learner.learnerapp.domain.UserExtra.class.getName() + ".cards", jcacheConfiguration);
            // jhipster-needle-ehcache-add-entry
        };
    }
}
