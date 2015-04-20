/**
 * @name Site
 * @description Define global variables and functions
 * @version 1.0
 */
var Site = (function($, window, undefined) {
  var privateVar = 1;

  function privateMethod1() {
    // todo
  }

  return {
    publicVar: 1,
    publicObj: {
      var1: 1,
      var2: 2
    },
    publicMethod1: privateMethod1
  };

})(jQuery, window);

jQuery(function() {
  Site.publicMethod1();
});

/**
 *  @name tabs
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'tabs';

  var HASH_LINK = window.location.hash,
      WIN = $(window),
      MAX_WIDTH_MOBILE = 768;

  var actTab = function(hrefAnchor) {
    var effect = this.options.effect,
        duration = this.options.duration;
    switch (effect) {
      case 'slide':
        this.listTabContent.find(hrefAnchor).slideDown(duration)
            .siblings().slideUp(duration);
        break;
      case 'fade':
        this.listTabContent.find(hrefAnchor).fadeIn(duration)
            .siblings().hide();
        break;
      default:
        this.listTabContent.find(hrefAnchor).show()
            .siblings().hide();
        break;
    }
  }

  var generateTabDropdown = function(numTabs) {
    var that = this,
        listTabLinks = that.listTabLinks,
        toggleTab = that.toggleTab,
        duration = that.options.duration,
        display;

    if (numTabs > 2 && WIN.width() < MAX_WIDTH_MOBILE) {
      if (!listTabLinks.hasClass('toggle-state')) {
        listTabLinks.addClass('toggle-state').hide();
        toggleTab.addClass('active').on('click.toggleTabLink', function(e) {
          display = listTabLinks.css('display');
          switch (display) {
            case 'none':
              listTabLinks.fadeIn(duration);
              break;
            default:
              listTabLinks.fadeOut(duration);
              break;
          }
        });
      }
    }
    else if (numTabs > 2 && WIN.width() >= MAX_WIDTH_MOBILE){
      if (listTabLinks.hasClass('toggle-state')) {
        listTabLinks.removeClass('toggle-state').show();
        toggleTab.removeClass('active').off('click.toggleTabLink');
      }
    }
  }

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
          ele = this.element,
          options = this.options,
          numTabs, initTab, defaultTabLink, defaultAnchor;

      this.listTabLinks = ele.children('.tab-links');
      this.listTabContent = ele.children('.tab-content');
      this.toggleTab = ele.children('.toggle-tab');
      numTabs = this.listTabLinks.children('li').length;

      if (HASH_LINK && options.isHash) {
        initTab = this.listTabLinks.find('a[href="' + HASH_LINK + '"]').parent('li').index();
      }
      else {
        initTab = options.defaultTab;
      }

      defaultTabLink = this.listTabLinks.find('li').eq(initTab);
      defaultAnchor = defaultTabLink.children('a').attr('href');

      generateTabDropdown.call(that, numTabs);

      WIN.on('resize', function(e) {
        generateTabDropdown.call(that, numTabs);
      });

      defaultTabLink.addClass('active');
      actTab.call(this, defaultAnchor);
      this.changeTab();
    },
    changeTab: function() {
      var that = this;
      this.listTabLinks.on('click.linkTab', 'li a', function(e) {
      	var hrefAnchor = $(this).attr('href'),
            options = that.options;

        e.preventDefault();
        // that.element.trigger('beforeChangeTab');

        $(this).parent('li').addClass('active')
               .siblings().removeClass('active');
        actTab.call(that, hrefAnchor);

        if (typeof that.toggleTab !== 'undefined') {
          that.toggleTab.children('.text-toggle-tab').text($(this).text());

          if (that.toggleTab.hasClass('active')) {
            that.listTabLinks.fadeOut(options.duration);
          }
        }

        if (options.isHash) {
          window.location.hash = hrefAnchor;
        }

        that.element.trigger('afterChangedTab');
      });
    },
    destroy: function() {
      // deinitialize
      $.removeData(this.element[0], pluginName);
      this.listTabLinks.off('click.linkTab');
      this.listTabLinks = null;
      this.listTabContent = null;
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    effect: 'fade', //slide, fade, show
    duration: 400,
    defaultTab: 0, // start at 0
    isHash: false
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
    $('[data-' + pluginName + ']').on('beforeChangeTab', function() {
      console.log('Before change tab!');
    });
    $('[data-' + pluginName + ']').on('afterChangedTab', function(){
      console.log('Tab changed');
    });
  });

}(jQuery, window));
