#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "${SCRIPT_DIR}/.env"

NOTIFIED=0

ssh -o StrictHostKeyChecking=no \
    -o ServerAliveInterval=60 \
    -o ExitOnForwardFailure=yes \
    -R 80:localhost:8080 localhost.run 2>&1 | \
while IFS= read -r line; do
    echo "$line"
    if [[ $NOTIFIED -eq 0 ]] && [[ "$line" =~ https://([a-f0-9]{14}\.lhr\.life) ]]; then
        NOTIFIED=1
        URL="https://${BASH_REMATCH[1]}"
        HOUR=$(TZ="Asia/Taipei" date +"%H")
        if [[ "$HOUR" == "22" ]]; then
            RESPONSE=$(curl -s -X POST "https://api.line.me/v2/bot/message/push" \
                -H "Authorization: Bearer ${LINE_CHANNEL_ACCESS_TOKEN}" \
                -H "Content-Type: application/json" \
                -d "{\"to\": \"${LINE_USER_ID}\", \"messages\": [{\"type\": \"text\", \"text\": \"可阜選股工具已上線：${URL}\"}]}")
            if echo "$RESPONSE" | grep -q '"sentMessages"'; then
                echo "[notify] LINE 已發送：${URL}"
            else
                echo "[notify] LINE 發送失敗：${RESPONSE}"
            fi
        else
            echo "[notify] 非排程時間，略過通知"
        fi
    fi
done
