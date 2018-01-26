(function(window, $ , undefined){
	var _block_namespaces_ = window._block_namespaces_ || ( window._block_namespaces_ = {});
    var name = "photoGallery";
    var photoGallery = _block_namespaces_[name] || (_block_namespaces_[name] = {});
    $.extend(photoGallery, {
    	"init" : init
    })
    
    function init(nodeObj){
        if (!!!nodeObj) {
            return;
        }
    	$(window).resize(function() { 
            $('div[data-settingid=' + nodeObj.settingId + '] div[data-auto_uuid=' + nodeObj.nodeId + '] .sitewidget-common-gallery-detail').each(function(){
                $(this).height($(this).width());
            });
        });
        $(window).resize();
    }
})(window,jQuery);