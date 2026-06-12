// 可配置的文件
window.kt_config = {
  usePixelStream: false, // 是否使用 UE 像素流
  usePixelStreamMultiplayer: true,//采用多对多像素流 or 一对一像素流
  ws_url: "ws://10.1.10.21:89/ws/", // ws 返回一个像素流地址，一定要有末尾的 /，用于后端匹配像素流ip 也就是 stream_port，UE像素流多对多地址
  stream_port: "", // 多对多流媒体端口 用于后端匹配像素流ip
  stream_ip: "http://10.1.10.20:1235/", // UE像素流一对一地址
};