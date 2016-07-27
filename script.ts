(function (global) {
    'use strict';

    const {$, Rx} = global;

    $(() => {
        const refreshButton = $('#suggestions .refresh')[0];
        const refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');

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

        const close1Button = $('#suggestion1 .close')[0];
        const close1ClickStream = Rx.Observable.fromEvent(close1Button, 'click');

        const suggestion1Stream = close1ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(() => {
                return null;
            }))
            .startWith(null);

        suggestion1Stream.subscribe(res => {
            updateSuggestion($('#suggestion1'), res);
        });

        const close2Button = $('#suggestion2 .close')[0];
        const close2ClickStream = Rx.Observable.fromEvent(close2Button, 'click');

        const suggestion2Stream = close2ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(() => {
                return null;
            }))
            .startWith(null);

        suggestion2Stream.subscribe(res => {
            updateSuggestion($('#suggestion2'), res);
        });

        const close3Button = $('#suggestion3 .close')[0];
        const close3ClickStream = Rx.Observable.fromEvent(close3Button, 'click');

        const suggestion3Stream = close3ClickStream
            .startWith('startup click')
            .combineLatest(responseStream, randomUser)
            .merge(refreshClickStream.map(() => {
                return null;
            }))
            .startWith(null);

        suggestion3Stream.subscribe(res => {
            updateSuggestion($('#suggestion3'), res);
        });
    });

})(this);