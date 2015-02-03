'use strict';

describe('accessible-tabs', function() {

    var markUp =
        '<div class="tabs example-a">' +
            '<h2>Tabs panel one</h2>' +
            '<div>' +
                '<p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p>' +
            '</div>' +
            '<h2>Tabs panel two</h2>' +
            '<div>' +
                '<p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis.</p>' +
                '<p>Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus.</p>' +
            '</div>' +
            '<h2>Tabs panel three</h2>' +
            '<div>' +
                '<p>Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.</p>' +
            '</div>' +
        '</div><!-- .tabs -->',
        testElement,
        testElement2;

    beforeEach(function() {
        testElement = $(markUp);
    });

    it('depends on jQuery', function() {
        expect($).toBeDefined();
    });

    it('should be protected against multiple instantiations', function() {
        var plugin = testElement.accTabs();
        expect(plugin === testElement.accTabs()).toBe(true);
    });

    describe('- plugin init', function() {

        beforeEach(function() {
            testElement.accTabs();
        });

        it('should creating an unordered list for the tab controls', function() {
            expect(testElement.find('> ul').hasClass('js-tabs_control')).toBe(true);
            expect(testElement.find('> ul').attr('role')).toBe('tablist');
        });

        it('should create a control for each tab panel', function() {
            var numberOfPanels = testElement.find('> div').length;

            expect(testElement.find('> ul > li').length).toBe(numberOfPanels);

            $('> ul > li', testElement).each(function(index, value) {
                expect($(value).attr('role')).toBe('presentation');

                expect($(value).find('> button').attr('aria-selected')).toBeDefined();
                expect($(value).find('> button').attr('role')).toBe('tab');
            });
        });

        it('should hide the heading for each tab panel', function() {

            $('> div', testElement).each(function(index, value) {
                expect($(value).prev().is(':hidden')).toBe(true);
            });
        });

        it('should add a class and attributes to each tab panel', function() {

            $('> div', testElement).each(function(index, value) {
                expect($(value).hasClass('js-tabs_panel')).toBe(true);
                expect($(value).attr('aria-labelledby')).toBeDefined();
                expect($(value).attr('aria-hidden')).toBeDefined();
                expect($(value).attr('id')).toBeDefined();
                expect($(value).attr('role')).toBe('tabpanel');
            });
        });

        it('should add the explanatory control text', function() {
            expect(testElement.find('.js-tabs_control-text').length).toBe(1);
        });

        it('should add the active class to the tabs', function() {
            expect(testElement.hasClass('js-tabs')).toBe(true);
        });

        it('should trigger "callbackCreate" once the plugin has been created', function() {
            var mocks,
                el,
                created = false;

            mocks = {
                callbackCreate: function(testElement) {
                    created = true;
                }
            },
            el = testElement.accTabs({
                callbackCreate: mocks.callbackCreate
            });

            expect(created).toBe(true);
        });

        describe('- createHandleKeyDown function', function() {
            var triggerKeyDown = function (element, keyCode) {
                /*
                Keyboard trigger function
                */
                var inputEl = element.find('> button'),
                    e = $.Event('keydown');

                e.which = keyCode;
                inputEl.trigger(e);
            };

            it('should handle arrow left keyboard events', function() {
                $('> ul > li', testElement).each(function() {
                    triggerKeyDown($(this), 37);

                    expect($(this).find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(false);
                    expect($(this).find('> button').attr('aria-selected')).toBe('false');

                    // Check if there is a previous control tab or move the last
                    if ($(this).prev().length !== 0) {
                        expect($(this).prev().find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).prev().find('> button').attr('aria-selected')).toBe('true');
                    } else {
                        expect($(this).parent().find('li:last > button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).parent().find('li:last > button').attr('aria-selected')).toBe('true');
                    }
                });
            });

            it('should handle arrow up keyboard events', function() {
                $('> ul > li', testElement).each(function() {
                    triggerKeyDown($(this), 38);

                    expect($(this).find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(false);
                    expect($(this).find('> button').attr('aria-selected')).toBe('false');

                    // Check if there is a previous control tab or move the last
                    if ($(this).prev().length !== 0) {
                        expect($(this).prev().find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).prev().find('> button').attr('aria-selected')).toBe('true');
                    } else {
                        expect($(this).parent().find('li:last > button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).parent().find('li:last > button').attr('aria-selected')).toBe('true');
                    }
                });
            });

            it('should handle arrow right keyboard events', function() {
                $('> ul > li', testElement).each(function() {
                    triggerKeyDown($(this), 39);

                    expect($(this).find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(false);
                    expect($(this).find('> button').attr('aria-selected')).toBe('false');

                    // Check if there is a next control tab or move the first
                    if ($(this).next().length !== 0) {
                        expect($(this).next().find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).next().find('> button').attr('aria-selected')).toBe('true');
                    } else {
                        expect($(this).parent().find('li:first > button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).parent().find('li:first > button').attr('aria-selected')).toBe('true');
                    }
                });
            });

            it('should handle arrow down keyboard events', function() {
                $('> ul > li', testElement).each(function() {
                    triggerKeyDown($(this), 40);

                    expect($(this).find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(false);
                    expect($(this).find('> button').attr('aria-selected')).toBe('false');

                    // Check if there is a next control tab or move the first
                    if ($(this).next().length !== 0) {
                        expect($(this).next().find('> button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).next().find('> button').attr('aria-selected')).toBe('true');
                    } else {
                        expect($(this).parent().find('li:first > button').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
                        expect($(this).parent().find('li:first > button').attr('aria-selected')).toBe('true');
                    }
                });
            });
        });
    });

    describe('- activateTab method', function() {

        beforeEach(function() {
            testElement = $(markUp);
            testElement.accTabs();
        });

        it('should add a class and attributes to the first tab control', function() {
            expect(testElement.find('button:first').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
            expect(testElement.find('button:first').attr('aria-selected')).toBe('true');
        });

        it('should show the first tab panel', function() {
            expect(testElement.find('div:first').css('display')).toBe('block');
            expect(testElement.find('div:first').attr('aria-hidden')).toBe('false');
        });
    });

    describe('- rebuild method', function() {

        beforeEach(function() {
            testElement2 = $(markUp);
        });

        it('should reinitiate the plugin', function() {
            var plugin = testElement.accTabs();

            plugin.data('plugin_accTabs').destroy();
            plugin.data('plugin_accTabs').rebuild();

            expect(plugin === testElement.accTabs()).toBe(true);
        });
    });

    describe('- destroy method', function() {

        beforeEach(function() {
            testElement2 = $(markUp);
        });

        it('should remove the container class', function() {
            testElement2.accTabs();

            testElement2.data('plugin_accTabs').destroy();

            expect(testElement2.hasClass('js-tabs')).toBe(false);
        });

        it('should remove the tab controls help text', function() {
            testElement2.accTabs();

            testElement2.data('plugin_accTabs').destroy();

            expect(testElement2.find('.js-tabs_control').length).toBe(0);
        });

        it('should remove the tab controls', function() {
            testElement2.accTabs();

            testElement2.data('plugin_accTabs').destroy();

            expect(testElement2.find('.js-tabs_control-text').length).toBe(0);
        });

        it('should reset the headings back to their original state', function() {
            testElement2.accTabs();

            testElement2.data('plugin_accTabs').destroy();

            expect(testElement2.find('> div').prev().attr('style')).toBe(undefined);
        });

        it('should reset the tab panels back to their original state', function() {
            testElement2.accTabs();

            testElement2.data('plugin_accTabs').destroy();

            expect(testElement2.find('> div').attr('aria-hidden')).toBe(undefined);
            expect(testElement2.find('> div').attr('aria-labelledby')).toBe(undefined);
            expect(testElement2.find('> div').attr('id')).toBe(undefined);
            expect(testElement2.find('> div').attr('role')).toBe(undefined);
            expect(testElement2.find('> div').attr('style')).toBe(undefined);
            expect(testElement2.find('> div').hasClass('js-tabs_panel')).toBe(false);
        });

        it('should trigger "callbackDestroy" once the plugin has been destroyed', function() {
            var mocks,
                el,
                destroyed = false;

            mocks = {
                callbackDestroy: function(testElement) {
                    destroyed = true;
                }
            },
            el = testElement.accTabs({
                callbackDestroy: mocks.callbackDestroy
            });

            el.data('plugin_accTabs').destroy();

            expect(destroyed).toBe(true);
        });
    });

    describe('- plugin options', function() {

        beforeEach(function() {
            testElement2 = $(markUp);
        });

        it('should activate a given tab if "defaultTab is set"', function() {
            testElement.accTabs({
                defaultTab: 2
            });

            expect(testElement.find('button:eq(2)').parent('li').hasClass('js-tabs_control-item--active')).toBe(true);
            expect(testElement.find('button:eq(2)').attr('aria-selected')).toBe('true');
            expect(testElement.find('div:eq(2)').css('display')).toBe('block');
            expect(testElement.find('div:eq(2)').attr('aria-hidden')).toBe('false');
        });

        it('should set the custom class on the tabs', function() {
            testElement.accTabs({
                containerClass: 'js-tabs--custom'
            });

            expect(testElement.hasClass('js-tabs--custom')).toBe(true);
        });

        it('should set the custom class on the active tab', function() {
            testElement.accTabs({
                controlActiveClass: 'js-tabs_control-item--custom'
            });

            expect(testElement.find('[aria-selected="true"]').parent('li').hasClass('js-tabs_control-item--custom')).toBe(true);
        });

        it('should set the custom controls text', function() {
            testElement.accTabs({
                controlsText: 'test'
            });

            expect(testElement.find('.js-tabs_control-text').text()).toBe('test');
        });

        it('should set the custom class on the control text', function() {
            testElement.accTabs({
                controlsTextClass: 'js-tabs_control-text--custom'
            });

            expect(testElement.find('> p').hasClass('js-tabs_control-text--custom')).toBe(true);
        });

        it('should set the custom string for tab control ids', function() {
            testElement.accTabs({
                tabControlId: 'test--'
            });

            expect(testElement.find('button[id^="test--"]').length).toBe(3);
        });

        it('should set the custom class for the tab panels', function() {
            testElement.accTabs({
                tabPanelClass: 'test'
            });

            expect(testElement.find('> div').hasClass('test')).toBe(true);
        });

        it('should set the custom string for the panel ids', function() {
            testElement.accTabs({
                tabPanelId: 'test--'
            });

            expect(testElement.find('div[id^="test--"]').length).toBe(3);
        });
    });
});