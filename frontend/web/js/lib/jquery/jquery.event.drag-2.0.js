/*! wallpaint - v0.0.1 - 2013-11-26 */(function(t){t.fn.drag=function(e,i,s){var n="string"==typeof e?e:"",a=t.isFunction(e)?e:t.isFunction(i)?i:null;return 0!==n.indexOf("drag")&&(n="drag"+n),s=(e==a?i:s)||{},a?this.bind(n,s,a):this.trigger(n)};var e=t.event,i=e.special,s=i.drag={defaults:{which:1,distance:0,not:":input",handle:null,relative:!1,drop:!0,click:!1},datakey:"dragdata",livekey:"livedrag",add:function(i){var n=t.data(this,s.datakey),a=i.data||{};n.related+=1,!n.live&&i.selector&&(n.live=!0,e.add(this,"draginit."+s.livekey,s.delegate)),t.each(s.defaults,function(t){void 0!==a[t]&&(n[t]=a[t])})},remove:function(){t.data(this,s.datakey).related-=1},setup:function(){if(!t.data(this,s.datakey)){var i=t.extend({related:0},s.defaults);t.data(this,s.datakey,i),e.add(this,"mousedown",s.init,i),this.attachEvent&&this.attachEvent("ondragstart",s.dontstart)}},teardown:function(){t.data(this,s.datakey).related||(t.removeData(this,s.datakey),e.remove(this,"mousedown",s.init),e.remove(this,"draginit",s.delegate),s.textselect(!0),this.detachEvent&&this.detachEvent("ondragstart",s.dontstart))},init:function(n){var a,o=n.data;if(!(o.which>0&&n.which!=o.which||t(n.target).is(o.not)||o.handle&&!t(n.target).closest(o.handle,n.currentTarget).length||(o.propagates=1,o.interactions=[s.interaction(this,o)],o.target=n.target,o.pageX=n.pageX,o.pageY=n.pageY,o.dragging=null,a=s.hijack(n,"draginit",o),!o.propagates)))return a=s.flatten(a),a&&a.length&&(o.interactions=[],t.each(a,function(){o.interactions.push(s.interaction(this,o))})),o.propagates=o.interactions.length,o.drop!==!1&&i.drop&&i.drop.handler(n,o),s.textselect(!1),e.add(document,"mousemove mouseup",s.handler,o),!1},interaction:function(e,i){return{drag:e,callback:new s.callback,droppable:[],offset:t(e)[i.relative?"position":"offset"]()||{top:0,left:0}}},handler:function(t){var n=t.data;switch(t.type){case!n.dragging&&"mousemove":if(Math.pow(t.pageX-n.pageX,2)+Math.pow(t.pageY-n.pageY,2)<Math.pow(n.distance,2))break;t.target=n.target,s.hijack(t,"dragstart",n),n.propagates&&(n.dragging=!0);case"mousemove":if(n.dragging){if(s.hijack(t,"drag",n),n.propagates){n.drop!==!1&&i.drop&&i.drop.handler(t,n);break}t.type="mouseup"}case"mouseup":e.remove(document,"mousemove mouseup",s.handler),n.dragging&&(n.drop!==!1&&i.drop&&i.drop.handler(t,n),s.hijack(t,"dragend",n)),s.textselect(!0),n.click===!1&&n.dragging&&(jQuery.event.triggered=!0,setTimeout(function(){jQuery.event.triggered=!1},20),n.dragging=!1)}},delegate:function(i){var n,a=[],o=t.data(this,"events")||{};return t.each(o.live||[],function(o,r){0===r.preType.indexOf("drag")&&(n=t(i.target).closest(r.selector,i.currentTarget)[0],n&&(e.add(n,r.origType+"."+s.livekey,r.origHandler,r.data),0>t.inArray(n,a)&&a.push(n)))}),a.length?t(a).bind("dragend."+s.livekey,function(){e.remove(this,"."+s.livekey)}):!1},hijack:function(i,n,a,o,r){if(a){var l,h,c,u={event:i.originalEvent,type:i.type},d=n.indexOf("drop")?"drag":"drop",p=o||0,f=isNaN(o)?a.interactions.length:o;i.type=n,i.originalEvent=null,a.results=[];do if(h=a.interactions[p]){if("dragend"!==n&&h.cancelled)continue;c=s.properties(i,a,h),h.results=[],t(r||h[d]||a.droppable).each(function(o,r){return c.target=r,l=r?e.handle.call(r,i,c):null,l===!1?("drag"==d&&(h.cancelled=!0,a.propagates-=1),"drop"==n&&(h[d][o]=null)):"dropinit"==n&&h.droppable.push(s.element(l)||r),"dragstart"==n&&(h.proxy=t(s.element(l)||h.drag)[0]),h.results.push(l),delete i.result,"dropinit"!==n?l:void 0}),a.results[p]=s.flatten(h.results),"dropinit"==n&&(h.droppable=s.flatten(h.droppable)),"dragstart"!=n||h.cancelled||c.update()}while(f>++p);return i.type=u.type,i.originalEvent=u.event,s.flatten(a.results)}},properties:function(t,e,i){var n=i.callback;return n.drag=i.drag,n.proxy=i.proxy||i.drag,n.startX=e.pageX,n.startY=e.pageY,n.deltaX=t.pageX-e.pageX,n.deltaY=t.pageY-e.pageY,n.originalX=i.offset.left,n.originalY=i.offset.top,n.offsetX=t.pageX-(e.pageX-n.originalX),n.offsetY=t.pageY-(e.pageY-n.originalY),n.drop=s.flatten((i.drop||[]).slice()),n.available=s.flatten((i.droppable||[]).slice()),n},element:function(t){return t&&(t.jquery||1==t.nodeType)?t:void 0},flatten:function(e){return t.map(e,function(e){return e&&e.jquery?t.makeArray(e):e&&e.length?s.flatten(e):e})},textselect:function(e){t(document)[e?"unbind":"bind"]("selectstart",s.dontstart).attr("unselectable",e?"off":"on").css("MozUserSelect",e?"":"none")},dontstart:function(){return!1},callback:function(){}};s.callback.prototype={update:function(){i.drop&&this.available.length&&t.each(this.available,function(t){i.drop.locate(this,t)})}},i.draginit=i.dragstart=i.dragend=s})(jQuery);