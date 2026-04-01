@import "tailwindcss";

/* モバイルファーストのレスポンシブ設計 */
body {
  margin: 0;
  padding: 0;
  /* 重要: 100vw は避ける（スクロールバー考慮がないため） */
  overflow-x: hidden;
  width: 100%;
}

#root {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
