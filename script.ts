(function (global) {
    'use strict';

    const {$, Rx} = global;

    $(() => {
        const $suggestions = $('.suggestions')[0];

        const $refreshButton = $('.refresh', $suggestions)[0];
        const refreshClickStream = Rx.Observable.fromEvent($refreshButton, 'click');

        const requestStream = refreshClickStream
            .startWith('startup click')
            .map(() => {
                let offset = Math.floor(Math.random() * 500);
                return `https://api.github.com/users?since=${offset}`;
            });

        const responseStream = requestStream
            .flatMap(url => {
                return Rx.Observable.fromPromise($.getJSON(url));
            })
            .publish()
            .refCount();

        const randomUser = (click, list) => {
            return list[Math.floor(Math.random() * list.length)];
        };

        const updateSuggestion = ($parent, data) => {
            if (data) {
                $('img.media-object', $parent)
                    .attr('src', data.avatar_url)
                    .attr('alt', data.login);
                $('a.user-login', $parent)
                    .attr('href', data.html_url)
                    .text(data.login);
                $parent.css('display', 'block');
            } else {
                $parent.css('display', 'none');
            }
        };

        const createSuggestionStream = closeClickStream => {
            return closeClickStream
                .startWith('startup click')
                .combineLatest(responseStream, randomUser)
                .merge(refreshClickStream.map(() => {
                    return null;
                }))
                .startWith(null);
        };

        const $close1Button = $('.suggestion1 .close', $suggestions)[0];
        const close1ClickStream = Rx.Observable.fromEvent($close1Button, 'click');
        createSuggestionStream(close1ClickStream)
            .subscribe(res => {
                updateSuggestion($('.suggestion1', $suggestions), res);
            });

        const $close2Button = $('.suggestion2 .close', $suggestions)[0];
        const close2ClickStream = Rx.Observable.fromEvent($close2Button, 'click');
        createSuggestionStream(close2ClickStream)
            .subscribe(res => {
                updateSuggestion($('.suggestion2', $suggestions), res);
            });

        const $close3Button = $('.suggestion3 .close', $suggestions)[0];
        const close3ClickStream = Rx.Observable.fromEvent($close3Button, 'click');
        createSuggestionStream(close3ClickStream)
            .subscribe(res => {
                updateSuggestion($('.suggestion3', $suggestions), res);
            });
    });

})(this);