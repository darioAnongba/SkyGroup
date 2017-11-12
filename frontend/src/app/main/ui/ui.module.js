(function ()
{
    'use strict';

    angular
        .module('app.ui', [
            'app.ui.forms'
        ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('ui', {
            title : 'FLIGHTS AND HOTELS',
            group : true,
            weight: 3
        });

        msNavigationServiceProvider.saveItem('ui.forms', {
            title: 'Dashboard',
            icon : 'icon-window-restore',
            state: 'app.ui_forms'
        });
    }
})();
