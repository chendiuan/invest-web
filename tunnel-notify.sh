#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/.env"
CHANNEL_ID="${DISCORD_CHANNEL_ID}"
MSG_ID_FILE="/home/test/invest-web/.discord-last-msg-id"

ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=60 \
    -o ExitOnForwardFailure=yes \
    -R 80:localhost:8080 localhost.run 2>&1 | \
while IFS= read -r line; do
    echo "$line"
    if [[ "$line" =~ ([a-f0-9]{14}\.lhr\.life) ]]; then
        URL="https://${BASH_REMATCH[1]}"

        # 刪除上一則訊息
        if [[ -f "$MSG_ID_FILE" ]]; then
            OLD_ID=$(cat "$MSG_ID_FILE")
            curl -s -X DELETE "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages/${OLD_ID}" \
                -H "Authorization: Bot ${DISCORD_TOKEN}" > /dev/null
            echo "[notify] Discord 舊訊息已刪除：${OLD_ID}"
        fi

        # 發送新訊息並儲存 message ID
        RESPONSE=$(curl -s -X POST "https://discord.com/api/v10/channels/${CHANNEL_ID}/messages" \
            -H "Authorization: Bot ${DISCORD_TOKEN}" \
            -H "Content-Type: application/json" \
            -d "{\"content\": \"可阜選股工具網址已更新：${URL}\"}")
        NEW_ID=$(echo "$RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        if [[ -n "$NEW_ID" ]]; then
            echo "$NEW_ID" > "$MSG_ID_FILE"
            echo "[notify] Discord 已發送（id=${NEW_ID}）：${URL}"
        else
            echo "[notify] Discord 發送失敗：${RESPONSE}"
        fi
    fi
done
