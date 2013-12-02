(function(kweb, $, undefined) {

  // Private properties.
  kweb.currentBlogUrl = null;
  kweb.editor = null;
  kweb.updateTimer = null;

  kweb.setupEditor = function() {
    var opts = {
      container: 'epiceditor',
      textarea: 'markdown-contents',
      basePath: '',
      clientSideStorage: false,
      localStorageName: 'epiceditor',
      useNativeFullscreen: true,
      parser: marked,
      file: {
        name: 'epiceditor',
        defaultContent: '',
        autoSave: 7000
      },
      theme: {
        base: '/themes/base/epiceditor.css',
        preview: '/themes/preview/github.css',
        editor: '/themes/editor/epic-dark.css'
      },
      button: {
        preview: true,
        fullscreen: true,
        bar: "auto"
      },
      focusOnLoad: false,
      shortcut: {
        modifier: 18,
        fullscreen: 70,
        preview: 80
      },
      string: {
        togglePreview: 'Toggle Preview Mode',
        toggleEdit: 'Toggle Edit Mode',
        toggleFullscreen: 'Enter Fullscreen'
      },
      autogrow: true
    };
    kweb.editor = new EpicEditor(opts).load();
  };

  kweb.setupAutomaticSaving = function() {
    // Sets up the autosaving.
    kweb.editor.on('update', function() {
      window.clearTimeout(kweb.updateTimer);
      kweb.updateTimer = setTimeout(function() {
        // Auto-saves the blog post.
        kweb.save();
      }, 3000);
    });
  };

  kweb.save = function(callback) {
    if (kweb.currentBlogUrl !== null) {
      window.clearTimeout(kweb.updateTimer);
      $('#save-state').show();
      $.ajax({
        type: 'PATCH',
        dataType: 'json',
        url: kweb.currentBlogUrl,
        data: $('#blog-form').serialize()
      }).success(function() {
        $('#save-state').hide();
        callback();
      }).error(function() {
        // TODO: Do something here!!!!!!!!!!!
        callback();
      });
    }
  };

}(window.kweb = window.kweb || {}, jQuery));