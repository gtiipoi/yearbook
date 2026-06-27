"""在线状态系统 — 使用 last_email_notified 列作为心跳时间戳。
无需数据库变更，已在 yearbook.html 中实现轮询心跳机制。"""
print("在线状态系统使用 last_email_notified 列，无需额外设置。")
print("工作原理：")
print("  - 每20秒发送心跳，更新 last_email_notified")
print("  - 45秒内有心跳的用户显示为在线")
print("  - 使用 REST API 轮询，不依赖 WebSocket")
print("  - 微信浏览器兼容")
