# ChatGPT的回答的响应看不到的原理及例子

如图：
![image](https://user-images.githubusercontent.com/15936231/219986461-790833d3-079e-4176-a08f-e85b630e74bd.png)
![image](https://user-images.githubusercontent.com/15936231/219986490-0331ebbb-cbd4-4490-8422-a3e743d60926.png)
是收到了响应数据的，有5.8 KB，但是 EventStream 却什么都没有。

一开始确实毫无头绪，但 [@phodal][phodal] 给出了思路，觉得是一些 http 的奇技淫巧，后来我顺着这个思路找下去发现不可能是 http 层面的问题，因为 [spec][spec] 说明如果不是 event、data、id 或 retry 就会被浏览器丢掉，js 没有机会做骚操作，我又翻了下 [webkit 的源码][webkit eventsource] 佐证了这一事实：浏览器并没有特殊实现，完全按照 spec 来的
![image](https://user-images.githubusercontent.com/15936231/219986725-82690528-ba21-4949-8383-b4e46f2e9b5c.png)


最后经过研究发现其实服务端并没有进行什么骚操作，只是浏览器端使用了[server-sent-event(sse)][sse], 但是没有用标准的 EventSource，而是自己fetch，只不过 `request header` 加上了 ['Accept': 'text/event-stream'][fetch]. 具体操作可以看本仓库示例


[phodal]: https://github.com/phodal
[webkit eventsource]: https://github.com/WebKit/webkit/blob/main/Source/WebCore/page/EventSource.cpp#L371-L388
[sse]: https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
[fetch]: https://github.com/CGQAQ/server-sent-event-example/blob/b5f673ad57a0b987291f9eca4ef35e67e1b6f479/index.html#L11
[spec]: https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation
