<script setup lang="ts">
// import store from '@/store';
import { CACHE } from '@/ktJS/CACHE';
import {
  Config,
  PixelStreaming,
} from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.2';
import {
  Application,
  PixelStreamingApplicationStyle,
} from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.2';
import { onMounted, ref } from 'vue';

const loading = ref<boolean>(true);
const pixelStreamingContainerRef = useTemplateRef<HTMLDivElement>('pixelStreamingContainerRef');

CACHE.pixelStream = {
  stream: null,
  application: null,
};

let isServerReloading = false;

// 初始化像素流
function initPixelStreaming(ssUrl) {
  // 控制UI样式
  const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle({
    customStyles: {
      '#uiFeatures': {
        display: 'none',
      },
    },
  });
  PixelStreamingApplicationStyles.applyStyleSheet();

  // 像素流播放的一些配置
  const config = new Config({
    useUrlParams: true,
    initialSettings: {
      ss: ssUrl, // 流媒体服务器地址
      AutoConnect: true, // 自动连接：如果为 true，应用启动时会自动连接到流媒体服务器。
      AutoPlayVideo: true, // 自动播放视频：如果为 true，在连接成功后视频将自动播放。
      StartVideoMuted: true, // 启动时静音：如果为 true，视频在开始播放时会处于静音状态。
      MinQP: 30, // 最小量化参数：用于控制视频编码的最小质量水平，数值越低，品质越好，但带宽消耗也越大。
      XRControllerInput: false, // XR 控制器输入：如果为 true，允许 XR（虚拟现实）控制器的输入。
      GamepadInput: false, // 游戏手柄输入：如果为 true，允许使用游戏手柄进行控制。
      TouchInput: false, // 触摸输入：如果为 true，允许在触摸屏设备上进行交互。
      HoveringMouse: true, // 鼠标悬停：如果为 true，允许鼠标悬停并与 UI 进行交互。
      SuppressBrowserKeys: false, // 抑制浏览器按键：如果为 true，将抑制浏览器的某些键盘输入，以防止干扰应用内的控制。
      MatchViewportRes: true, // 匹配视窗分辨率：如果为 true，将调整视频分辨率以匹配视窗分辨率。
    },
  });

  const stream = new PixelStreaming(config);

  stream._webRtcController.shouldReconnect = false;

  // 通过这个函数获取像素流信令交互的ids，来判断像素流是否可以链接成功，否者断开stream，然后就会出发 webRtcDisconnected ,再次重连
  const preOnStreamerList = stream.webSocketController.onStreamerList;
  stream.webSocketController.onStreamerList = function (...args) {
    preOnStreamerList.call(this, ...args);
    if (args[0] && Array.isArray(args[0].ids)) {
      if (!args[0].ids.includes('DefaultStreamer')) {
        setTimeout(() => {
          stream.disconnect();
        }, 1000);
      }
    }
  };

  const application = new Application({
    stream,
    onColorModeChanged: isLightMode => PixelStreamingApplicationStyles.setColorMode(isLightMode),
  });

  // 加载完毕 重写 onPlayStream 添加 loading 状态
  const onPlayStream = application.onPlayStream.bind(application);

  application.onPlayStream = function (...args) {
    onPlayStream(...args);
    loading.value = false;
    // ueWebEmitter?.emit('pixel-loaded', { type: 'pixel-loaded', data: {} });
    // 这里可以判断ue是否加载完
  };

  // 添加到 dom
  pixelStreamingContainerRef.value.appendChild(application.rootElement);
  // 缓存
  CACHE.pixelStream.stream = stream;
  CACHE.pixelStream.application = application;

  // 监听断开连接
  stream._eventEmitter.addEventListener('webRtcDisconnected', (event) => {
    if (isServerReloading)
      return;
    stream.reconnect();
  });

  // 监听消息
  stream.addResponseEventListener('handle_responses', (data) => {
    window.ue.interface.UEemit(data);
  });
}

async function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
// 在函数外部定义重连状态（避免被多次调用时重置）
const reconnectState = {
  retryCount: 0,
  maxRetries: 3, // 最大重试次数
  baseDelay: 1000, // 基础延迟时间 (1秒)
  currentTimer: null as NodeJS.Timeout | null, // 当前定时器引用
};

async function initWs() {
  // 清理之前的连接和定时器
  if (reconnectState.currentTimer) {
    clearTimeout(reconnectState.currentTimer);
    reconnectState.currentTimer = null;
  }

  // 超过最大重连次数时停止
  if (reconnectState.retryCount >= reconnectState.maxRetries) {
    console.error('WebSocket 重连超过最大次数，停止尝试');
    return;
  }

  try {
    await sleep(300);
    const port = sessionStorage.getItem('port') || '';
    const ws = new WebSocket(`${window.kt_config.ws_url}${port}`);

    // 心跳配置
    const heartbeatInterval = 3000; // 明确使用 3 秒心跳
    let heartbeatTimer: NodeJS.Timeout | null = null;

    // 成功连接时重置重试计数器
    ws.onopen = () => {
      console.log('WebSocket 连接成功');
      reconnectState.retryCount = 0; // 重置计数器
      isServerReloading = false;

      // 心跳机制
      heartbeatTimer = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send('heartbeat');
        }
      }, heartbeatInterval);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.code === 200) {
        const { ipAddress, streamerPort } = message.data;
        const url = `http://${ipAddress}`;

        initPixelStreaming(url);

        if (streamerPort) {
          sessionStorage.setItem('port', streamerPort);
          window.kt_config.stream_port = streamerPort;
        }
      }
      else {
        // 使用更友好的错误提示方式
        console.error('服务器返回错误:', message.message);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket 连接关闭');
      cleanupResources(ws, heartbeatTimer);

      // 指数退避重连：延迟 = baseDelay * 2^retryCount
      const delay = reconnectState.baseDelay * 2 ** reconnectState.retryCount;
      reconnectState.retryCount++;

      console.log(`将在 ${delay}ms 后尝试第 ${reconnectState.retryCount} 次重连...`);
      reconnectState.currentTimer = setTimeout(initWs, delay);
    };

    ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
      cleanupResources(ws, heartbeatTimer);
    };
  }
  catch (err) {
    console.error('WebSocket 初始化异常:', err);
  }
}

// 资源清理函数
function cleanupResources(
  ws: WebSocket | null,
  timer: NodeJS.Timeout | null,
) {
  if (timer)
    clearInterval(timer);
  if (ws)
    ws.close();
  // 仅清除必要项，而非整个 sessionStorage
  sessionStorage.removeItem('port');
  isServerReloading = true;
}

onMounted(() => {
  if (window.kt_config.usePixelStreamMultiplayer) {
    initWs();
  }
  else {
    initPixelStreaming(window.kt_config.stream_ip);
  }
});
</script>

<template>
  <div
    ref="pixelStreamingContainerRef"
    class="pixel-streaming-container"
    :class="{
      loaded: !loading,
    }"
  />
</template>

<style scoped>
.pixel-streaming-container {
  height: 100%;
  width: 100%;
  opacity: 0;
  position: absolute;
  left:0;
  top:0;
  transition: opacity 0.5s ease-in-out;
  min-height: 100px; /** 最小高度 放置不可见 */
}
.pixel-streaming-container.loaded {
  opacity: 1;
}
</style>
