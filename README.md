# ChatGPT的回答的响应看不到的原理及例子

一开始确实毫无头绪，但 [@phodal][phodal] 给出出了思路，觉得是一些 http 的奇技淫巧，后来我顺着这个思路找下去发现不可能是 http 层面的问题，因为 spec 说明如果不是 data、retry 或 event就会被浏览器丢掉，js 没有机会做骚操作，我又翻了下 [webkit 的源码][webkit eventsource]佐证了这一事实：浏览器并没有特殊实现，完全按照 spec 来的

最后经过研究发现其实服务端并没有进行什么骚操作，只是浏览器端使用了[server-sent-event(sse)][sse], 但是没有用标准的 EventSource，而是自己fetch，只不过 `request header` 加上了 ['Accept': 'text/event-stream'][fetch].


[phodal]: https://github.com/phodal
[webkit eventsource]: https://github.com/WebKit/webkit/blob/main/Source/WebCore/page/EventSource.cpp#L371-L388
[sse]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
[fetch]: https://github.com/CGQAQ/server-sent-event-example/blob/b5f673ad57a0b987291f9eca4ef35e67e1b6f479/index.html#L11
